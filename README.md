# Ray Lukorito — Portfolio

Personal portfolio built with Vite, React 19, TypeScript, Tailwind CSS 4 and Motion.
Design: a warm, vintage-print look — Fraunces + Bricolage Grotesque + Caveat, paper grain,
halftone dots, and hand-built SVG posters for each project.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

## Edit content

All copy — intro, projects, experience, education, certificates, tools, links — lives in
[`src/data/content.ts`](src/data/content.ts). Add a project to `projects` or
`alsoBuilt` and it appears on the page.

Design tokens (colours, fonts, animations) are in [`src/index.css`](src/index.css)
under `@theme`. The project poster illustrations live in
[`src/components/art/Posters.tsx`](src/components/art/Posters.tsx); a new project needs a
`poster` kind there.

## Deploy to GitHub Pages

1. Create a repo — `raykl640.github.io` to serve at https://raykl640.github.io,
   or any other name to serve at `https://raykl640.github.io/<repo>/`.
2. Push this folder to its `main` branch.
3. In the repo, open **Settings → Pages** and set **Source** to **GitHub Actions**.

The workflow in `.github/workflows/deploy.yml` builds and publishes on every push
to `main`, setting the correct base path automatically.

Vercel or Netlify also work with zero config: build command `npm run build`,
output directory `dist`.

## Interactive pieces

| Piece | Where | Notes |
| --- | --- | --- |
| 3D paper-cut hero (WebGL) | `diorama/scene.ts`, `diorama/landscape.ts` | Layered hills, acacias, sun, clouds, birds. Pointer parallax; scroll dollies the camera, sets the sun, brings out stars. Lazy-loaded at idle, renders only while visible, adaptive resolution governor for slow GPUs |
| Instant/fallback landscape | `diorama/StaticDiorama.tsx` | Same hills as SVG; paints first, and stays if WebGL is unavailable or reduced motion is on |
| Stacked project sheets | `Work.tsx` | Desktop: sheets pin and stack like a file drawer. Phones: normal flow |
| Pop-up posters | `art/PopPoster.tsx`, layers in `art/Posters.tsx` | Pointer tilt on desktop, scroll tilt on touch |
| Ink cursor | `ui/InkCursor.tsx` | Labels come from `data-cursor`; mouse/trackpad only |
| Proximity headline | `ui/ProximityText.tsx` | Contact heading letters swell near the pointer (variable font weight) |
| Ink letters, headline reveals | `Hero.tsx`, `ui/RevealText.tsx` | |
| Issued stamps, torn edges, running head | `Record.tsx`, `art/TornEdge.tsx`, `Navbar.tsx` | |
| Smooth scroll | `lib/scroll.ts` | Lenis on wheel/trackpad; native touch scrolling on phones |
