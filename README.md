# OTOGE Archive

A Japanese-first, static song browser for maimai DX, CHUNITHM, and ONGEKI. It is a fan-made companion to [OTOGE DB](https://github.com/zvuc/otoge-db), built with React, TypeScript, and Vite.

## Run it

```bash
npm install
npm run dev
npm run build
```

The app uses hash routes (`#/maimai`, `#/chunithm`, `#/ongeki`, `#/favorites`, `#/about`) so it works on GitHub Pages without server-side routing. Set `BASE_PATH=/repository-name/ npm run build` when deploying under a project subpath.

## Data refresh

The checked-in `public/data` directory is a local snapshot of OTOGE DB's `music-ex.json`, international files where available, deleted archives, and jacket directories. Run `npm run refresh-data` to clone the latest upstream repository and replace those snapshots. The browser never depends on GitHub raw URLs at runtime.

The normalizer intentionally follows the actual schemas: maimai exposes `sort`, `title`, `catcode`, `lev_*`, and `date_added`; CHUNITHM exposes `id`, `catname`, `lev_*`, `version`, and `date_added`; ONGEKI exposes `id`, `category`, `lev_*`, `bells`, and `version`. These datasets generally provide one source-language string rather than separate translation fields, so it is preserved as both Japanese-priority and original text. Japanese source strings are preferred, with a fallback chain of original, English, romaji, and `Unknown`.

## GitHub Pages

Build with `BASE_PATH=/your-repository/ npm run build`, then publish `dist` with any Pages workflow or static hosting action. No backend, credentials, login, or API key is required.

## Attribution and limitations

OTOGE DB's code is MIT licensed; see its [copyright and source notes](https://github.com/zvuc/otoge-db#copyright). OTOGE DB credits SEGA public data and community sources. SEGA and respective rightsholders own the game names, logos, and jacket art. This project keeps the upstream jacket snapshot local for this static fan tool and does not claim ownership; remove or replace those assets if your distribution context does not permit them. Some source records do not include English/romaji, exact release dates, chart constants, or international flags; these fields are shown as unavailable rather than invented. Favorites are stored only in browser localStorage.

Design direction: deep navy cabinet-black, hard-edged data panels, technical mono labels, and three game-specific accent palettes make this feel closer to a hand-built music-select screen than a generic dashboard.
