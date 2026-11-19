const assert = require("node:assert/strict");
const { chromium } = require(process.env.RUNNER_TEMP + "/af-check/node_modules/playwright-core");
const { PNG } = require(process.env.RUNNER_TEMP + "/af-check/node_modules/pngjs");

(async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROME_BIN,args:["--no-sandbox"]});
  try {
    const page = await browser.newPage({reducedMotion:"reduce"});
    for (const width of [320,390,768,833,1024,1280,1440,1512,1920]) {
      await page.setViewportSize({width,height:900});
      await page.goto("http://localhost:3000/");
      const layout = await page.evaluate(async () => {
        await document.fonts.ready;
        const numbers = [...document.querySelectorAll(".af-feature-project__content > .af-micro, .af-project-card__content > .af-micro")].filter(el => /^\s*\d+\s*$/.test(el.textContent));
        const cards = [...document.querySelectorAll(".af-project-card__description")].slice(0,3);
        return {
          numbers: numbers.length,
          lines: cards.map(el => {
            const text = el.firstChild;
            const lines = new Map();
            for (const word of text.textContent.matchAll(/\S+/g)) {
              const range = new Range();
              range.setStart(text,word.index);
              range.setEnd(text,word.index+word[0].length);
              const y = range.getBoundingClientRect().top;
              lines.set(y,(lines.get(y) ?? 0)+1);
            }
            return [...lines.values()];
          }),
          motionHidden: [...document.querySelectorAll(".af-project-card__pulses,.af-project-card__fog,.af-project-card__sunlight")].every(el=>getComputedStyle(el).display==="none")
        };
      });
      assert.equal(layout.numbers,0);
      assert.ok(layout.motionHidden);
      assert.ok(layout.lines.every(line=>line.length===1||line.at(-1)>1),width+"px "+JSON.stringify(layout.lines));
      console.log(width+"px layout passed "+JSON.stringify(layout.lines));
    }

    await page.setViewportSize({width:390,height:844});
    await page.emulateMedia({reducedMotion:"no-preference"});
    await page.goto("http://localhost:3000/#work");
    for (const [motion, duration, timeA, timeB, minimum] of [
      ["map",8400,800,3100,.02],
      ["fog",5000,300,2200,.05],
      ["sunset",9000,1800,4050,.08],
    ]) {
      const art = page.locator(".af-project-card__artwork").filter({has:page.locator('[data-artwork-motion="'+motion+'"]')});
      await art.scrollIntoViewIfNeeded();
      await art.locator("img").evaluate(img=>img.decode());
      const setFrame = time => art.evaluate((element,time)=>element.getAnimations({subtree:true}).map(animation=>{
        animation.pause();
        animation.currentTime=time;
        return animation.effect.getTiming().duration;
      }),time);
      assert.ok((await setFrame(timeA)).includes(duration),motion+" duration");
      const before = PNG.sync.read(await art.screenshot());
      await setFrame(timeB);
      const after = PNG.sync.read(await art.screenshot());
      let changed = 0;
      for(let i=0;i<before.data.length;i+=4) {
        if([0,1,2].some(channel=>Math.abs(before.data[i+channel]-after.data[i+channel])>=12)) changed++;
      }
      const fraction = changed/(before.width*before.height);
      console.log(motion+" changed "+(fraction*100).toFixed(2)+"% of pixels");
      assert.ok(fraction > minimum,motion+" must be visible");
    }
  } finally {
    await browser.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
