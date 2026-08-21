# OTOGE Archive

A Japanese-first song browser for **maimai DX**, **CHUNITHM**, and **ONGEKI**.

OTOGE Archive is a small, fan-made static site for browsing song details without
an account or backend. Its catalog data is bundled locally from a snapshot of
[OTOGE DB](https://github.com/zvuc/otoge-db).

## What it does

- Browse the current and archived catalogs for all three games
- Search Japanese titles, English aliases, romaji, artists, and song IDs
- Filter by difficulty, level, BPM, version, category, and international availability
- View chart details, note designers, release information, and jacket art
- Save favorites locally in your browser

## Run locally

```bash
git clone https://github.com/sixteenjune/otoge-tracker.git
cd otoge-tracker
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build:

```bash
npm run build
npm run preview
```

## Data

The checked-in files in `public/data` are snapshots from OTOGE DB. Refresh them
from the latest upstream data with:

```bash
npm run refresh-data
```

This clones OTOGE DB, copies the game data and jacket images into the site, and
keeps the browser independent of GitHub raw URLs at runtime. The refresh script
requires Git.

English and romaji search aliases are maintained in
`public/data/aliases.json`. Add stable `game:id` entries when a song needs a
searchable alias.

Some upstream records do not include English or romaji names, exact release
dates, or international availability. In those cases, the site displays
“Not available” rather than guessing.

## Deploy

The site is built with React, TypeScript, and Vite and uses hash routes, so it
works on GitHub Pages without server-side routing. The Pages workflow deploys
the `dist` directory from `main`.

The build currently targets the site root. For a GitHub Pages project subpath,
set `base` in `vite.config.ts` to `/your-repository/`. For a custom domain, add
a `CNAME` file containing the domain name to `public/`.

## Attribution

Song data comes from [OTOGE DB](https://github.com/zvuc/otoge-db), whose code is
MIT licensed. OTOGE DB credits SEGA public data and community sources.

SEGA and the respective rightsholders own the game names, logos, and jacket art.
This project does not claim ownership of those assets; replace or remove them
if your distribution context requires it.

OTOGE Archive is an unofficial fan project and is not affiliated with SEGA.
