# Valley Sans specimen (minisite)

Static specimen built with **Vite**, **TypeScript**, and **Tailwind CSS** (v4 via `@tailwindcss/vite`). Global rules and `@font-face` live in [`src/index.css`](./src/index.css); layout and typography use utilities in [`index.html`](./index.html). Roman and italic variable WOFF2 are read from **`../fonts/webfonts/`** during development and copied into **`dist/fonts/webfonts/`** on production build.

## Prerequisites

Run `make build` in the repository root so **`fonts/webfonts/ValleySans[wght].woff2`** and **`ValleySans-Italic[wght].woff2`** exist (or commit those files if you keep them in git).

## Commands

```bash
cd documentation
npm install
npm run dev
```

Build for deploy:

```bash
npm run build
npm run preview   # optional local check of dist/
```

Output is **`documentation/dist/`**. Ship that directory plus any server config your host needs; font URLs in the built CSS use **`/fonts/webfonts/…`** (same path under `dist/` after build).

## Editing the page

- **`documentation/index.html`** — this is what **`npm run dev`** serves. Edit here while developing.
- **`documentation/dist/`** — created by **`npm run build`**. Safari at **`npm run preview`** reads this folder. Changes you make only inside `dist/` are overwritten on the next build and **do not** affect `npm run dev`.

If Safari shows an old version: save the file, confirm the dev terminal picked up the reload, then **Develop → Empty Caches** (with **Disable caches** enabled while the Develop menu is open) or a hard reload (**⌥⌘E** empty cache, or **⇧⌘R** reload). `npm run dev` must be running from **`documentation/`**.

See [MINISITE_PLAN.md](./MINISITE_PLAN.md) for product scope and checklist.
