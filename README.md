# Analog Future website

Production website for Analog Future, built from the approved Figma file as a
responsive, accessible codebase rather than a PDF or flattened page export.

## Current status

- Homepage rebuilt from the “READY FOR DEV / Home / Desktop” frame
- Shared wordmark, project-card, and process-card components established
- Approved homepage artwork exported locally from Figma
- Interactive #WeCount page and its historical data implementation preserved
- Desktop, tablet, and mobile layout rules included
- Production build passing

The remaining case-study routes will be implemented from the corresponding
ready-for-development Figma frames:

- /work/cadence
- /work/cubed
- /work/earthen
- /work/valmia
- /work/coolbuilding
- /work/simplesite

/work/wecount already contains the working interactive reconstruction.

## Technology

- TypeScript
- React / Next-compatible App Router structure
- CSS design tokens and reusable site components
- Client-side SVG and data interaction for #WeCount

The current checkout retains its existing Vinext/Cloudflare build adapter.
The site components themselves are not tied to a hosting provider. Once hosting
is chosen, only the build and deployment adapter should need to change.

## Local commands

~~~bash
npm ci
npm run dev
npm run build
~~~

## Design source

[Analog Future website in Figma](https://www.figma.com/design/QXHQAw0WusgMHZ90TDX4H6/Analog-Future-website)

The Figma file remains the source of truth for layout, copy, exported artwork,
and responsive intent. Website structure, typography, links, and interactions
are implemented natively in code.
