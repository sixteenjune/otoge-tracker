# OTOGE Archive

A Japanese-first, static song browser for maimai DX, CHUNITHM, and ONGEKI. It is a fan-made companion to [OTOGE DB](https://github.com/zvuc/otoge-db), built with React, TypeScript, and Vite.

## Run it

```bash
npm install
npm run dev
npm run build
```

The app uses hash routes (`#/maimai`, `#/chunithm`, `#/ongeki`, `#/favorites`, `#/about`) so it works on GitHub Pages without server-side routing. The build is configured for a root path (`/`) for deployment behind a custom domain; if you deploy under a GitHub Pages project subpath instead (e.g. `username.github.io/repo-name`), set `base` in `vite.config.ts` to `/repo-name/` accordingly.

## Data refresh

The checked-in `public/data` directory is a local snapshot of OTOGE DB's `music-ex.json`, international files where available, deleted archives, and jacket directories. Run `npm run refresh-data` to clone the latest upstream repository and replace those snapshots. The browser never depends on GitHub raw URLs at runtime.

English and romaji search aliases live in `public/data/aliases.json`; add stable `game:id` entries there when an upstream title has no searchable English name.

The normalizer intentionally follows the actual schemas: maimai exposes `sort`, `title`, `catcode`, `lev_*`, `dx_lev_*`, `lev_utage`, and `date_added`; CHUNITHM exposes `id`, `catname`, `lev_*`, `lev_we`, `we_kanji`, `we_star`, `version`, and `date_added`; ONGEKI exposes `id`, `category`, `lev_*`, `bells`, and `version`. Special maimai and CHUNITHM records are merged into their matching base song by title and artist, preserving Utage and WORLD'S END as separate chart difficulties. Chart credits are normalized as note designers. These datasets generally provide one source-language string rather than separate translation fields, so it is preserved as both Japanese-priority and original text. Japanese source strings are preferred, with a fallback chain of original, English, romaji, and `Unknown`.

## GitHub Pages

`npm run build` publishes `dist` for a root path, which is what the `.github/workflows/deploy.yml` Pages workflow deploys on every push to `main`. If you're using a custom domain, add a `CNAME` file with your domain name to `public/` so it's copied into `dist` on build. No backend, credentials, login, or API key is required.

## Attribution and limitations

OTOGE DB's code is MIT licensed; see its [copyright and source notes](https://github.com/zvuc/otoge-db#copyright). OTOGE DB credits SEGA public data and community sources. SEGA and respective rightsholders own the game names, logos, and jacket art. This project keeps the upstream jacket snapshot local for this static fan tool and does not claim ownership; remove or replace those assets if your distribution context does not permit them. Some source records do not include English/romaji, exact release dates, or international flags; these fields are shown as unavailable rather than invented. Favorites are stored only in browser localStorage.

The weekly `Refresh OTOGE DB snapshot` workflow updates the local data and opens a pull request for review. Merging that pull request redeploys the Pages site through the normal deployment workflow.
