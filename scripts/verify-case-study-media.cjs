const assert = require("node:assert/strict");
const { mkdir } = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require(path.join(process.env.RUNNER_TEMP, "case-study-check", "node_modules", "playwright-core"));

const cases = {
  simplesite: {
    media: [],
    captures: [["hero", ".ss-hero__visual"]],
  },
  cubed: {
    media: [".cubed-hero-media", ".cubed-split > img", ".cubed-applications > img"],
    captures: [["brand", ".cubed-problem"], ["palette", ".identity-colors"]],
  },
  earthen: {
    media: [".earthen-problem__media img", ".earthen-editorial__media img"],
    captures: [["editorial", ".earthen-editorial__media"]],
  },
  valmia: {
    media: [".vm-hero__visual", ".vm-product > img", ".vm-strategy img", ".vm-place img"],
    captures: [["product", ".vm-product"], ["community", ".vm-community"], ["place", ".vm-place__grid"]],
  },
  coolbuilding: {
    media: [".cb-idea__visual"],
    captures: [["idea", ".cb-idea"]],
  },
};

async function inspect(page, project, config, width) {
  const measurements = await page.evaluate(async ({ project, media }) => {
    const errors = [];
    const images = media.length ? [...document.querySelectorAll(media.join(","))] : [];
    const visibleImages = images.filter(image => image.getBoundingClientRect().width > 0);
    await Promise.all(visibleImages.map(async image => {
      image.loading = "eager";
      try {
        await image.decode();
      } catch {
        errors.push("Image did not decode: " + image.alt);
      }
    }));

    function checkHorizontal(element, container) {
      const box = element.getBoundingClientRect();
      const bounds = container.getBoundingClientRect();
      if (box.left < bounds.left - 1 || box.right > bounds.right + 1) {
        errors.push(element.className + " extends outside its section");
      }
    }

    for (const image of visibleImages) {
      checkHorizontal(image, image.closest("section"));
      const box = image.getBoundingClientRect();
      const naturalHeight = box.width * image.naturalHeight / image.naturalWidth;
      if (Math.abs(box.height - naturalHeight) > 1.5) {
        errors.push(image.alt + " is cropped or distorted: " + box.width + "x" + box.height);
      }
    }

    if (project === "simplesite") {
      const wrapper = document.querySelector(".ss-hero__visual");
      const bounds = wrapper.getBoundingClientRect();
      if (bounds.width > 0) {
        const artwork = wrapper.querySelector("svg");
        const viewBox = artwork.viewBox.baseVal;
        const top = new DOMPoint(viewBox.x, viewBox.y).matrixTransform(artwork.getScreenCTM());
        const bottom = new DOMPoint(viewBox.x + viewBox.width, viewBox.y + viewBox.height)
          .matrixTransform(artwork.getScreenCTM());
        for (const [actual, expected] of [[top.x, bounds.left], [top.y, bounds.top], [bottom.x, bounds.right], [bottom.y, bounds.bottom]]) {
          if (Math.abs(actual - expected) > 1) errors.push("SimpleSite artwork has a gutter");
        }
      } else if (document.querySelector(".ss-hero__mobile").getBoundingClientRect().width <= 0) {
        errors.push("SimpleSite mobile artwork is hidden");
      }
    }

    if (project === "cubed") {
      const palette = document.querySelector(".identity-colors");
      const swatches = [...palette.querySelectorAll("i")];
      for (const swatch of swatches) checkHorizontal(swatch, palette);
      if (swatches.length !== 3 || swatches.some(swatch => swatch.getBoundingClientRect().width <= 0)) {
        errors.push("Cubed palette is missing a swatch");
      }
      const grid = document.querySelector(".cubed-identity");
      for (const cell of grid.querySelectorAll(".identity-cell")) checkHorizontal(cell, grid);
    }

    if (project === "valmia") {
      const section = document.querySelector(".vm-community");
      for (const element of section.querySelectorAll(".vm-community__chart, .vm-community__node")) {
        checkHorizontal(element, section);
      }
    }

    return { errors, images: visibleImages.length };
  }, { project, media: config.media });

  assert.deepEqual(measurements.errors, [], project + " at " + width + "px");
  if (width > 832 && config.media.length) {
    assert.ok(measurements.images > 0, project + " artwork is visible at " + width + "px");
  }
  console.log(project + " passed at " + width + "px");
}

async function main() {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_BIN || undefined,
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    const screenshots = path.join(process.env.RUNNER_TEMP, "case-study-layout-screenshots");
    await mkdir(screenshots, { recursive: true });
    for (const [project, config] of Object.entries(cases)) {
      for (const width of [390, 832, 900, 1024, 1152, 1280, 1366, 1512, 1920]) {
        await page.setViewportSize({ width, height: width > 1400 ? 1024 : 800 });
        const response = await page.goto("http://127.0.0.1:3000/work/" + project);
        assert.ok(response.ok(), project + " loads");
        await inspect(page, project, config, width);
        if (width === 1280) {
          for (const [name, selector] of config.captures) {
            await page.locator(selector).screenshot({
              path: path.join(screenshots, project + "-" + name + ".jpg"),
              type: "jpeg",
              quality: 70,
              animations: "disabled",
            });
          }
        }
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
