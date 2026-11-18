# Developer handoff

## Source snapshot

This is the complete code and asset snapshot for Analog Future Sites version 91.

- Original source commit: `7e522950e063465265e9cb3ad8621a597c5432c5`
- Preview: https://analog-future-case-study-preview.anjica-bananica.chatgpt.site
- GitHub branch: `handoff/analog-future-v89`
- Intended production domain: `analog-future.co`

Application code and assets match the preview. `SOURCE_SNAPSHOT.json` records the original tracked files and Git blob hashes, including the Sites README.

## Updates since version 75

- Homepage wordmark, service alignment, reduced grain, and a pulsing down arrow.
- Sticky mobile navigation and revised homepage card layout, including the shorter Cadence thumbnail.
- Responsive case-study layouts with smaller titles, tightened service lines, screenshot crops and carousels, and identity panel adjustments.
- Cadence blue timeslice wave, daily and yearly timeline motion, and animated hours, spend, and mood analytics.
- Centered the mobile homepage hero. The navigation appears on scroll, and the three mobile service rows on the Studio page share consistent spacing.
- More compact scope sections, logo-first layouts for SimpleSite, ValMia, and Earthen, and revised typography for the Earthen program and #WeCount intro.
- Thinner Cadence category icons and an updated construction photo throughout the SimpleSite product walkthrough.

## Get the code

```bash
git clone --branch handoff/analog-future-v89 --single-branch https://github.com/andrealausevic/analog-future-website.git
cd analog-future-website
npm ci
npx vite
```

Use Node.js 22.13 or newer. The local URL is printed by Vite. Dependencies are pinned in `package-lock.json`; retain it.

To build, test, and preview the production build:

```bash
npx vinext build
node --test tests/*.test.mjs
npx vinext start
```

The existing `npm run build` and `npm test` commands use Linux shell helpers with GNU `timeout`. The direct commands above avoid those wrappers on macOS. On Windows, use WSL for the supplied npm shell scripts or invoke the direct commands.

## What is included

- Homepage and Studio page, including responsive layouts, lilac calls to action, and Studio ping-pong.
- Cadence has a blue timeslice wave that gathers into the logo, animated timeline views, and rolling statistics.
- Cubed: white identity symbol and 12-column grid.
- Earthen: original high-resolution hero photograph and SVG wordmark.
- #WeCount: interactive historical data explorer; beige interface inside its border with the website's charcoal outside.
- Coolbuilding: local interactive architectural atlas with flags, zoom, dragging, and building cards.
- SimpleSite: restored photo mockup and wordmark, with the symbol assembling from the center on load; diagonals at 40% opacity.
- Valmia and all other case-study content and assets.
- Working shared navigation and reciprocal previous/next project links across all seven projects.

## Source map

| Area | Files |
| --- | --- |
| Homepage | `app/page.tsx`, `app/home-panels.css`, `app/globals.css` |
| Studio | `app/studio/`, `components/site/` |
| Case studies | `app/work/` |
| Shared project navigation | `components/site/project-navigation.tsx`, `components/site/case-study-footer.tsx`, `lib/project-order.ts` |
| #WeCount | `components/wecount/`, `lib/wecount-*`, `app/work/wecount/` |
| Coolbuilding atlas | `public/assets/coolbuilding/atlas-hero.html` |
| Images, SVGs, fonts | `public/assets/`, `public/fonts/`, `public/textures/` |
| Motion | `app/motion.css`, `components/site/site-motion.tsx`, project CSS |
| Runtime and build | `vite.config.ts`, `worker/index.ts`, `build/sites-vite-plugin.ts` |

## Publish using the current Cloudflare adapter

The existing target is Cloudflare Workers, not a static HTML export. Build output contains `dist/client/` for assets and `dist/server/` for the Worker, including generated `wrangler.json`.

1. Choose the production Cloudflare account and Worker name. Configure account, routes/custom domain, and asset bindings in persistent project configuration before deployment. Keep generated output reproducible instead of relying on edits to `dist/`.
2. Authenticate Wrangler locally, or supply the account's deployment token through the hosting platform's secrets settings.
3. Run the build and checks above.
4. Deploy the generated Worker configuration with Wrangler:

```bash
npx wrangler deploy --config dist/server/wrangler.json
```

5. Attach `analog-future.co` in the chosen hosting account and configure DNS there. Check both the apex domain and `www` behavior.

The portfolio pages do not currently need a database or bucket: `d1` and `r2` are null in `.openai/hosting.json`. That file also records the existing Sites project identity; it is build metadata, not a GitHub or Cloudflare credential.

The Worker contains an optional `/_vinext/image` optimization route expecting `ASSETS` and `IMAGES` bindings. If that route will be used, configure both in the deployment target. The portfolio's current image elements load files directly from `public/`.

The Sites build for version 91 succeeded. Use the checks below to verify the build in the destination hosting environment.

## Publish on Vercel

The `deploy/vercel` branch builds the v91 portfolio with Next.js. Use the
repository root. Vercel reads the framework, install command, and build command
from `vercel.json`. The portfolio routes require no environment variables.

1. Import `andrealausevic/analog-future-website` as a new project in Vercel.
2. In the project, open **Settings → Environments → Production → Branch
   Tracking**. Set the production branch to `deploy/vercel`.
3. From **Deployments → Create Deployment**, deploy `deploy/vercel`.
4. When the production deployment is **Ready**, use the project's
   `.vercel.app` domain to run the launch checks below.

To run the same build locally, use Node.js 22.13 or newer and run:

```bash
npm ci --include=dev
npm run build:vercel
npm exec -- next start
```

## Launch checks

- Open all nine routes directly and refresh each one.
- Check Work, About, Contact, project cards, and the complete previous/next cycle.
- Confirm fonts and high-resolution images load from local assets.
- Check desktop and phone layouts.
- Check the Cadence hero, timeline, and analytics animations on desktop and mobile. Check the SimpleSite logo assembly. Reduced-motion settings show still graphics.
- Exercise #WeCount month/state/zoom controls and the Coolbuilding atlas.
- Compare against the approved preview before switching the domain.

Keep `public/` intact. Do not replace the vector hero elements with flattened screenshots. No credentials, dependencies, or generated build output are part of this handoff.
