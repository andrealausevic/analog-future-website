const assert = require("node:assert/strict");
const { mkdir } = require("node:fs/promises");
const { chromium } = require(process.env.RUNNER_TEMP + "/landing-check/node_modules/playwright-core");
const { PNG } = require(process.env.RUNNER_TEMP + "/landing-check/node_modules/pngjs");

const origin = "http://127.0.0.1:3000/";
const screenshots = process.env.RUNNER_TEMP + "/landing-screenshots";
const map = ".af-project-card__pulses";
const fog = ".af-project-card__fog";

async function inspectLayout(page, width) {
  await page.setViewportSize({ width, height: 900 });
  const response = await page.goto(origin);
  assert.ok(response.ok());
  const result = await page.evaluate(async () => {
    await document.fonts.ready;
    const descriptions = [...document.querySelectorAll(".af-project-card__description")].map(node => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      const card = node.parentElement.getBoundingClientRect();
      return {
        text: node.textContent,
        fontSize: style.fontSize,
        weight: style.fontWeight,
        lines: Math.round(rect.height / parseFloat(style.lineHeight)),
        fits: rect.bottom <= card.bottom + 1,
      };
    });
    const tabs = [...document.querySelectorAll(".af-panel__tab")].map(node => {
      const rect = node.getBoundingClientRect();
      return { width: rect.width, left: rect.left, right: rect.right };
    });
    const footer = document.querySelector(".af-footer");
    const wordmark = footer.querySelector(".af-wordmark");
    const category = document.querySelector(".af-feature-project__category");
    return {
      descriptions, tabs,
      cadence: category.innerText,
      footerWidth: footer.getBoundingClientRect().width,
      footerEmails: [...footer.querySelectorAll('a[href^="mailto:"]')].map(link => link.getAttribute("href")),
      footerWordmark: [...wordmark.querySelectorAll("span")].map(span => span.textContent).join(" "),
      footerWordmarkHref: wordmark.getAttribute("href"),
      overlays: [".af-project-card__pulses", ".af-project-card__fog"].map(selector => getComputedStyle(document.querySelector(selector)).display),
    };
  });
  assert.equal(result.descriptions.length, 6);
  for (const description of result.descriptions) {
    assert.equal(description.weight, "400");
    assert.equal(description.fontSize, "13.2px");
    assert.ok(!description.text.startsWith("#"));
    assert.ok(description.fits && description.lines <= 2, width + "px: " + JSON.stringify(description));
  }
  assert.equal(result.cadence, "AN ANALOG FUTURE DIGITAL PRODUCT");
  assert.deepEqual(result.footerEmails, ["mailto:info@analogfuture.dev", "mailto:info@analogfuture.dev"]);
  assert.equal(result.footerWordmark, "Analog Future");
  assert.equal(result.footerWordmarkHref, "#top");
  assert.deepEqual(result.overlays, ["none", "none"]);
  if (width > 832) {
    assert.equal(result.tabs.length, 4);
    const expected = Math.min(300, (result.footerWidth - 18) / 4);
    for (const tab of result.tabs) assert.ok(Math.abs(tab.width - expected) < .05, JSON.stringify(result.tabs));
    assert.ok(result.tabs[3].right <= result.footerWidth + .1);
  }
  console.log(width + "px: project copy, category, footer and tab layout passed");
}

async function scrollToThumbnail(page, selector) {
  const artwork = page.locator(".af-project-card__artwork").filter({ has: page.locator(selector) });
  await artwork.evaluate(element => {
    const anchor = document.getElementById("work").getBoundingClientRect().top + scrollY;
    const inner = element.closest(".af-work__inner");
    const offset = element.getBoundingClientRect().top - inner.getBoundingClientRect().top;
    window.scrollTo({ top: anchor + offset - 120, behavior: "instant" });
  });
  await artwork.locator("img").evaluate(image => image.decode());
  return artwork;
}

async function inspectMotion(page) {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(origin);
  await page.waitForFunction(() => document.querySelector(".af-home--panels").dataset.afPanels === "ready");

  const mapArt = await scrollToThumbnail(page, map);
  const pulses = await page.locator(map).evaluate(element => {
    const animations = element.getAnimations({ subtree: true });
    const dot = element.querySelector(".af-project-card__pulse");
    const animation = dot.getAnimations()[0];
    animation.pause();
    animation.currentTime = 0;
    const initial = getComputedStyle(dot).transform;
    animations.forEach(item => {
      item.pause();
      item.currentTime = 1500;
    });
    return { count: animations.length, initial, next: getComputedStyle(dot).transform };
  });
  assert.equal(pulses.count, 9);
  assert.notEqual(pulses.initial, pulses.next);
  await mapArt.screenshot({ path: screenshots + "/wecount.jpg", quality: 85 });

  const fogArt = await scrollToThumbnail(page, fog);
  const mist = await page.locator(fog).evaluate(element => {
    const animations = element.getAnimations({ subtree: true });
    for (const animation of animations) {
      animation.pause();
      animation.currentTime = 0;
    }
    const initial = getComputedStyle(element, "::before").transform;
    for (const animation of animations) animation.currentTime = 4000;
    return { count: animations.length, initial, next: getComputedStyle(element, "::before").transform };
  });
  assert.equal(mist.count, 2);
  assert.notEqual(mist.initial, mist.next);
  await fogArt.screenshot({ path: screenshots + "/valmia.jpg", quality: 85 });
  console.log("Map dots and both fog layers animate in the browser");
}

async function inspectFooter(page, width) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(origin);
  await page.waitForFunction(() => document.querySelector(".af-home--panels").dataset.afPanels === "ready");
  await page.evaluate(() => {
    const anchor = document.getElementById("contact");
    const top = anchor.getBoundingClientRect().top + scrollY;
    const tab = document.querySelector(".af-footer > .af-panel__tab");
    window.scrollTo({ top: top - tab.getBoundingClientRect().height, behavior: "instant" });
  });
  await page.waitForFunction(() => document.querySelector(".af-footer").getBoundingClientRect().top < 60);
  const footerTop = (await page.locator(".af-footer").boundingBox()).y;
  const capture = await page.screenshot({ path: screenshots + "/footer-" + width + ".png", clip: { x: 0, y: 0, width, height: 110 } });
  if (width === 1024) {
    const png = PNG.sync.read(capture);
    const pixel = (x, y) => Array.from(png.data.subarray((y * png.width + x) * 4, (y * png.width + x) * 4 + 3));
    const row = Math.round(footerTop) + 4;
    const edge = pixel(width - 3, row);
    const card = pixel(width - 53, row);
    assert.ok(edge.every((channel, index) => Math.abs(channel - card[index]) < 24), "Footer edge must share the card background: " + JSON.stringify({edge, card}));
  }
  console.log(width + "px: contact tab meets its card");
}

(async () => {
  await mkdir(screenshots, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, args: ["--no-sandbox"] });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    for (const width of [320, 390, 577, 832, 833, 1024, 1218, 1440, 1920]) await inspectLayout(page, width);
    await inspectMotion(page);
    for (const width of [1024, 1440]) await inspectFooter(page, width);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });