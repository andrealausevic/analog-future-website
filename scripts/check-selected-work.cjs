const assert = require("node:assert/strict");
const { chromium } = require(process.env.RUNNER_TEMP + "/af-check/node_modules/playwright-core");

(async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROME_BIN,args:["--no-sandbox"]});
  try {
    const page = await browser.newPage({reducedMotion:"reduce"});
    for (const width of [320,390,768,832,833,1024,1280,1512,1920]) {
      await page.setViewportSize({width,height:900});
      await page.goto("http://127.0.0.1:3000/");
      const layout = await page.evaluate(async () => {
        await document.fonts.ready;
        const left = el => el.getBoundingClientRect().left;
        const delta = (card, artwork, selector) => {
          const imageLeft = left(card.querySelector(artwork));
          return [...card.querySelectorAll(selector)].map(el=>left(el)-imageLeft);
        };
        const lines = [...document.querySelectorAll(".af-project-card__description")].slice(0,3).map(el => {
          const text = el.firstChild;
          const lines = new Map();
          for (const word of text.textContent.matchAll(/\S+/g)) {
            const range = new Range();
            range.setStart(text, word.index);
            range.setEnd(text, word.index+word[0].length);
            const y = range.getBoundingClientRect().top;
            lines.set(y, (lines.get(y) ?? 0)+1);
          }
          return [...lines.values()];
        });
        return {
          offsets: [...document.querySelectorAll(".af-project-card")].flatMap(card=>delta(card,".af-project-card__artwork",".af-project-card__content > *")),
          feature: delta(document.querySelector(".af-feature-project"),".af-feature-project__artwork",".af-feature-project__content > *"),
          lineWords: lines,
          backgrounds: ["body",".af-hero",".af-work",".af-footer"].map(s=>getComputedStyle(document.querySelector(s)).backgroundColor)
        };
      });
      assert.ok(layout.offsets.every(delta=>Math.abs(delta)<1),width+"px "+JSON.stringify(layout.offsets));
      assert.ok(layout.feature.every(delta=>width<=832?Math.abs(delta)<1:delta>0),width+"px "+JSON.stringify(layout.feature));
      assert.ok(layout.lineWords.every(line=>line.length===1||line.at(-1)>1),width+"px "+JSON.stringify(layout.lineWords));
      assert.ok(layout.backgrounds.every(color=>color==="rgb(17, 17, 17)"),JSON.stringify(layout.backgrounds));
      console.log(width+"px alignment and backgrounds passed");
    }
    const href = await page.locator('link[rel="icon"]').getAttribute("href");
    const favicon = await page.request.get(new URL(href,page.url()).href);
    assert.ok(favicon.ok());
    const svg = await favicon.text();
    assert.match(svg, /<rect[^>]+fill="#000"/);
    assert.match(svg, /<circle cx="32" cy="32" r="16" fill="#bfc5fd"/);
    console.log("Black favicon and lilac dot verified");
  } finally {
    await browser.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
