# Analog Future website

Complete website handoff from Sites version 89.

The source snapshot is `b8e33f1486e306f70fb1302000e59835d62e18b2`. This branch includes the homepage, Studio page, all seven case studies, local images and fonts, interactive maps, and the Cadence hero and analytics animations.

[Developer setup and publishing guide](DEVELOPER_HANDOFF.md)

## Run locally

Use Node.js 22.13 or newer.

```bash
npm ci
npx vite
```

## Build and check

```bash
npx vinext build
node --test tests/*.test.mjs
```

The existing `npm run build` wrapper is intended for Linux and requires GNU `timeout`. The direct build command above avoids that shell wrapper.

## Deployment target

This snapshot uses Vinext, Vite, React, and the Cloudflare Workers adapter. Keep that adapter for the closest match to the approved preview. See the handoff guide for deployment configuration and other hosting options.

## Approved preview

https://analog-future-case-study-preview.anjica-bananica.chatgpt.site

## Routes

- `/`
- `/studio`
- `/work/cadence`
- `/work/cubed`
- `/work/wecount`
- `/work/earthen`
- `/work/valmia`
- `/work/coolbuilding`
- `/work/simplesite`

All project assets are in `public/`. Preserve file names, casing, and folder structure.
