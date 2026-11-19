const assert = require("node:assert/strict");
const { chromium } = require(process.env.RUNNER_TEMP + "/af-check/node_modules/playwright-core");
const { PNG } = require(process.env.RUNNER_TEMP + "/af-check/node_modules/pngjs");

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, args: ["--no-sandbox"] });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    for (const width of [320, 390, 832, 833, 1024, 1280, 1512, 1920]) {
      await page.setViewportSize({width, height: 900});
      await page.goto("http://127.0.0.1:3000/");
      const layout = await page.evaluate(async () => {
        await document.fonts.ready;
        const sel = selector => document.querySelector(selector);
        const rect = selector => sel(selector).getBoundingClientRect();
        const cards = [...document.querySelectorAll(".af-project-card__description")];
        return {
          copy: cards.map(el => el.textContent),
          sameGray: cards.every(el => getComputedStyle(el).color === getComputedStyle(el.parentElement.querySelector(".af-micro")).color),
          lines: cards.map(el => Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight))),
          tabWidths: [...document.querySelectorAll(".af-panel__tab")].map(el => el.getBoundingClientRect().width),
          gap: rect(".af-hero__services").left - rect(".af-hero__future").right,
          footer: sel(".af-footer__location").textContent,
          studioColor: getComputedStyle(sel(".af-footer__location a")).color,
          lilac: getComputedStyle(document.documentElement).getPropertyValue("--af-lavender-light").trim()
        };
      });
      assert.ok(layout.sameGray);
      assert.ok(layout.lines.every(line => line <= 2), width + "px: " + JSON.stringify(layout.lines));
      for (const line of ["An app for finding local events and meeting people.", "An interactive map for discovering modern architecture.", "An app that turns construction photos and notes into searchable records."]) assert.ok(layout.copy.includes(line));
      assert.match(layout.footer, /Berlin · New York · Studio/);
      assert.equal(layout.studioColor, "rgb(" + layout.lilac.slice(1).match(/../g).map(x=>parseInt(x,16)).join(", ") + ")");
      if (width > 832) assert.ok(layout.tabWidths.every(tab => Math.abs(tab - Math.min(400,(width - 18)/4)) < 1));
      if (width > 832 && width <= 1512) assert.ok(layout.gap >= 0 && layout.gap < 100, width + "px gap " + layout.gap);
      console.log(width + "px layout passed, wordmark-to-services gap " + layout.gap.toFixed(1));
    }

    await page.setViewportSize({width:390,height:844});
    await page.emulateMedia({reducedMotion:"no-preference"});
    await page.goto("http://127.0.0.1:3000/#work");
    for (const [selector, duration, count, timeA, timeB] of [
      [".af-project-card__pulses", "16s", 6, 1000, 3800],
      [".af-project-card__fog", "9s", 2, 500, 3100]
    ]) {
      const art = page.locator(".af-project-card__artwork").filter({has: page.locator(selector)});
      await art.scrollIntoViewIfNeeded();
      await art.locator("img").evaluate(img => img.decode());
      const animations = await page.locator(selector).evaluate((element, time) => {
        return element.getAnimations({subtree:true}).map(animation => {
          animation.pause(); animation.currentTime = time;
          return animation.effect.getTiming().duration;
        });
      }, timeA);
      assert.equal(animations.length, count);
      assert.ok(animations.includes(parseInt(duration,10)*1000));
      const before = PNG.sync.read(await art.screenshot());
      await page.locator(selector).evaluate((element, time) => {
        element.getAnimations({subtree:true}).forEach(animation => { animation.currentTime = time; });
      }, timeB);
      const after = PNG.sync.read(await art.screenshot());
      let changed = 0;
      for (let i = 0; i < before.data.length; i+=4) {
        const diff = Math.max(...[0,1,2].map(channel => Math.abs(before.data[i+channel] - after.data[i+channel])));
        if (diff >= 12) changed++;
      }
      const fraction = changed / (before.width * before.height);
      console.log(selector + " changed " + changed + " pixels (" + (fraction*100).toFixed(2) + "%)");
      assert.ok(fraction > (selector.endsWith("fog") ? .05 : .002), "Motion should be visible in the rendered thumbnail");
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });