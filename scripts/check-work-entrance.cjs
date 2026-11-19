const assert = require("node:assert/strict");
const { chromium } = require(process.env.RUNNER_TEMP + "/af-check/node_modules/playwright-core");

(async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROME_BIN,args:["--no-sandbox"]});
  try {
    const page = await browser.newPage({reducedMotion:"no-preference"});
    for (const [width,height] of [[390,844],[833,720],[1280,800],[1440,900],[1920,1080]]) {
      await page.setViewportSize({width,height});
      await page.goto("http://127.0.0.1:3000/");
      await page.waitForSelector(".af-project-card[data-af-reveal]",{state:"attached"});
      const state = await page.evaluate(() => {
        const heading = document.getElementById("af-work-title");
        const feature = document.querySelector(".af-feature-project");
        window.scrollTo({top:window.scrollY+heading.getBoundingClientRect().top-window.innerHeight*.42,behavior:"instant"});
        return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => {
          const rect = heading.getBoundingClientRect();
          const hit = document.elementFromPoint(rect.left+8,rect.top+rect.height/2);
          resolve({
            visible: rect.top>=0 && rect.bottom<window.innerHeight && hit===heading,
            opacity:[heading,feature].map(el=>getComputedStyle(el).opacity),
            translate:[heading,feature].map(el=>getComputedStyle(el).translate),
            reveal:[heading,feature, ...feature.querySelectorAll("[data-af-reveal]")].map(el=>el.hasAttribute("data-af-reveal")),
            panel: getComputedStyle(document.querySelector(".af-work")).position,
            artAnimations: [".af-project-card__pulse",".af-project-card__fog",".af-project-card__sunlight"].map(s=>document.querySelector(s).getAnimations({subtree:true}).length)
          });
        })));
      });
      assert.ok(state.visible,width+"px heading is unobstructed");
      assert.deepEqual(state.opacity,["1","1"]);
      assert.deepEqual(state.translate,["none","none"]);
      assert.deepEqual(state.reveal,[false,false]);
      assert.equal(state.panel,width<=832?"relative":"sticky");
      assert.ok(state.artAnimations.every(n=>n>0));
      console.log(width+"px: Selected Work heading and Cadence artwork are steady. Thumbnail animation is active.");
    }
  } finally {
    await browser.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
