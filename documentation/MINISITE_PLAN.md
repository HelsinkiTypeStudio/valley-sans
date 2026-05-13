---
title: Valley Sans specimen minisite
status: draft
branch: minisite
---

# Valley Sans specimen minisite — plan

This document describes how to build a local-first, single-page specimen minisite **inside this repository**. Work is intended to happen on git branch **`minisite`**, then merge to the default branch when ready.

## Goals

- **Single long specimen page** with a clear hierarchy: minimal anchor nav, hero, type blocks, weight ladders (roman and italic), body text, CSS usage, FAQ, short technical appendix.
- **Self-contained front-end**: own `package.json` under **`documentation/`**, local components only, no dependency on external app codebases.
- **Content** from this repo’s [`README.md`](../README.md): commission, design story (Jansson lettering, archipelago, flared terminals, American modern gothic, flotsam), variable Thin–Black roman + italic, Latin scope, credits, OFL. Paraphrase as needed; stay factually aligned with the README (including the credits line: designed for Moomin Characters, designers, studio).
- **Images**: none in the first version (no hero art, no README figures). You may add **other** imagery in a later iteration when you want it.
- **Hosting**: local `npm run dev` (or equivalent) first; deploy as a static site to **your chosen host** (not assumed to be GitHub Pages). After a public URL exists, add **`minisite_url`** to [`METADATA.pb`](../METADATA.pb) (see README “Further development”).

## Where the code lives

- **Path**: the minisite app lives in **`documentation/`** (same directory as Google Fonts–style collateral such as `ARTICLE.en_us.html`, `images-license.txt`, and this plan). Scaffold `package.json`, `vite.config.ts`, `index.html`, and `src/` here, alongside those files.
- **Rationale**: keep specimen tooling next to existing documentation assets and separate from the Python font venv.

## Tooling choice

**Use Vite** for the specimen: fast dev server, `npm run build` → static `dist/`, and TypeScript if you want it. Output is plain static files for your host.

**React is optional** — **Vite + vanilla TypeScript** (or plain JS) is enough unless you explicitly want React for layout or state.

## Font files for the browser

- **Canonical WOFF2 paths in this repo** (after a normal font build that emits webfonts):  
  [`fonts/webfonts/ValleySans[wght].woff2`](../fonts/webfonts/ValleySans[wght].woff2) and [`fonts/webfonts/ValleySans-Italic[wght].woff2`](../fonts/webfonts/ValleySans-Italic[wght].woff2). Same basenames as in [`METADATA.pb`](../METADATA.pb) (TTF there; WOFF2 here).
- **Use them as the single source of truth** — do **not** regenerate WOFF2 for the specimen if these files already exist from `make build`.
- **“Direct” vs copy**: the browser only cares about the **URL** it is served. In the repo you can **reference** those paths from CSS in two ways:
  - **Development**: configure the dev server (e.g. Vite `server.fs.allow` and a resolve alias, or a small plugin) so `url(...)` resolves to `../../fonts/webfonts/…` from `documentation/`, **or** symlink `documentation/public/fonts` → repo `fonts/webfonts` if your team is happy maintaining that.
  - **Production / deploy**: either ship **`dist/` plus** the `fonts/webfonts/` tree on the host with URLs that match your CSS, **or** add an **`npm run build` step** that copies `fonts/webfonts/*.woff2` into the output folder so one upload is self-contained.
- **`make minisite-fonts`**: add a Makefile target **only if** you end up needing a conversion or copy step that should live in the font Makefile instead of `package.json` scripts. Prefer **`npm` scripts** (e.g. `cp` / `rsync` before `vite build`) when that is enough.

- **Variable TTF fallback**: [`Makefile`](../Makefile) still expects variable fonts under `fonts/variable/` (or `fonts/ttf`) for QA; webfonts are the specimen’s runtime format.

- **Axis bounds**: [`METADATA.pb`](../METADATA.pb) defines axis **`wght`** from **100** to **900** for both roman and italic. Use these in CSS and in ladder samples.

### Git and built webfonts

The repo root [`.gitignore`](../.gitignore) **no longer ignores `fonts/`**, so you can commit **`fonts/webfonts/*.woff2`** (and other build outputs) if you want clones to run the specimen without a local `make build`. Otherwise keep large binaries out of git and rely on CI or local builds—the specimen still reads from **`fonts/webfonts/`** as the canonical path after `make build`.

## Weight ladder labels

Drive row labels (and `wght` stops) from the **STAT / named instances** in [`sources/config.yaml`](../sources/config.yaml) (`Thin` … `Black` at 100 … 900) so the ladder matches font menus and Google Fonts metadata.

## CSS model (variable roman + variable italic)

Two `@font-face` rules, same `font-family`, different `font-style` and `src`:

- Roman VF: `font-style: normal;`
- Italic VF: `font-style: italic;`

Set `font-weight: 100 900` (or equivalent) when the browser supports variable fonts. Body text uses `font-variation-settings: 'wght' <number>` where useful; respect `font-weight` when simpler. In CSS `url(...)`, use **quoted** URLs for filenames that contain `[` and `]` (e.g. `url("/fonts/ValleySans[wght].woff2")`) so paths stay unambiguous.

## Page structure (scoped)

1. **Sticky nav** — Anchor links: Overview, Type, Weights, Body, Usage, FAQ (labels adjustable).
2. **Hero** — Large “Valley Sans” set in the family; one-line subtitle; optional primary CTA (e.g. link to GitHub releases or README) when you have a target.
3. **Overview** — README-driven paragraphs (no images in v1).
4. **Character rhythm** — Display-size A–Z, a–z, figures (and a few punctuation marks if useful).
5. **Weight ladder — roman** — One row per STAT stop from `sources/config.yaml`; sample phrase at each `wght`.
6. **Weight ladder — italic** — Same pattern using the italic VF.
7. **Body specimen** — Long excerpt at text sizes; roman and italic paragraphs.
8. **Usage** — Copy-paste HTML/CSS: dual `@font-face`, root `font-family`, `font-variation-settings` example (paths should match how you deploy webfonts).
9. **FAQ** — Short answers: variable font basics, axes, Latin scope, OFL pointer to [`OFL.txt`](../OFL.txt) and [openfontlicense.org](https://openfontlicense.org).
10. **Technical appendix** — UPM, `wght` min/max, version/vendor from built font if you automate later; for v1, METADATA.pb + README may suffice.

Defer a full **glyph matrix** and heavy **OpenType feature lab** unless you add them later in the same project.

## Tooling and repo hygiene

- **Scaffold** at `documentation/`: `package.json`, `vite.config.ts`, `index.html`, `src/`.
- **Root `.gitignore`**: it ignores **`package.json`** and **`package-lock.json`** everywhere except the specimen—use **`!documentation/package.json`** and **`!documentation/package-lock.json`** (and the same for pnpm/yarn lockfiles if needed). **`documentation/node_modules/`** is listed explicitly; **`documentation/dist/`** is covered by the existing **`dist/`** rule.
- **Contributor docs**: Add a short “Run the specimen” section to [`README.md`](../README.md) or `documentation/README.md` (minisite) with `cd documentation && npm install && npm run dev` (or equivalent).

## CI (optional, later)

- Optional workflow: `npm ci && npm run build` under `documentation/`, archive `dist/` (and document whether the archive should include copied webfonts for one-shot deploy).

## Implementation checklist

| Step | Action |
|------|--------|
| 1 | On branch **`minisite`**, scaffold **Vite** under **`documentation/`** (React optional). Ensure root **`.gitignore`** allows **`documentation/package.json`** / lockfile (see “Tooling and repo hygiene”); **`fonts/`** is trackable if you commit webfonts. |
| 2 | Wire `@font-face` to **`fonts/webfonts/`** WOFF2; add copy or dev-server resolution so dev and production URLs work. |
| 3 | Implement styling: **Tailwind** in `index.html` + `src/index.css` (`@font-face`, base resets); **Valley Sans** for all text via `font-sans` theme and `font-variation-settings` where needed. |
| 4 | Build sections per “Page structure”; weight ladders aligned with **`sources/config.yaml`** STAT (each row’s numeric **`wght`** matches STAT `value`; label matches STAT `name`). |
| 5 | Document local dev in README or `documentation/README.md`. |
| 6 | PR **`minisite` → default branch** when the first slice is ready. |
| 7 | After deploy: **`minisite_url`** in `METADATA.pb`; optional CI for the static build. |

## Open questions (only if still unclear at build time)

- Exact **deploy URL layout** (whether fonts are under `/fonts/…` or a CDN path) — drives the final `url()` in shipped CSS and any copy step.

---

*This file is the single source of truth for minisite planning in this repo. Edit it as the design evolves.*
