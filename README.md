# Rai

Movies, shows and reviews — a catalogue site for what to watch next, and where to watch it.

Built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS** and **Firebase (Firestore)**.

## Pages

| Route | What it does |
| --- | --- |
| `/` | Hero carousel plus one row per section: Talk Of The Town, Editor's Pick Of The Week, Worth Watching on Prime / Crunchyroll / Apple TV |
| `/browse` | Full catalogue with filters for type, platform, genre and row, plus A–Z / newest sorting (all filter state lives in the URL, so links are shareable) |
| `/search` | Free-text search over title, synopsis, genre, platform and language |
| `/title/[slug]` | Detail page: poster, meta, synopsis, where to watch, and related titles |
| `/about` | What Rai is and how the catalogue is maintained |
| `/api/search?q=` | JSON search endpoint (`{ query, count, results }`) for future clients |

## Run it locally

```bash
npm install
npm run dev
```

That is enough — with no Firebase configuration the site reads `data/titles.json` directly. Nothing else is required to see the full site.

```bash
npm run typecheck   # tsc --noEmit
npm run build       # production build
npm start           # serve the production build
```

## Firebase setup

1. Create a Firebase project, then add a **Web app** and copy its config values into `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   Fill in `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`.

2. Deploy the security rules. They allow public reads and block all client writes:

   ```bash
   firebase deploy --only firestore:rules
   ```

3. Create a service account (Project settings → Service accounts → Generate new private key), paste the whole JSON on one line into `FIREBASE_SERVICE_ACCOUNT` in `.env.local`, then seed:

   ```bash
   npm run seed
   ```

The seed script uses the Admin SDK because `firestore.rules` denies client writes — the browser never writes to Firestore.

### How data is read

`lib/content.ts` reads the `titles` collection when Firebase is configured, and falls back to the bundled JSON if the collection is empty or the read throws. Set `NEXT_PUBLIC_USE_LOCAL_DATA=1` to force local data even when Firebase is set up. Pages revalidate every 300 seconds.

## Deploy on Render

`render.yaml` is a blueprint for a free Node web service:

- build: `npm ci && npm run build`
- start: `npm run start`
- health check: `/`

Import the repo in Render → **New → Blueprint**, pick `kristream91-ui/rai`, and Render creates
the service from `render.yaml`. It will ask for the six `NEXT_PUBLIC_FIREBASE_*` values because
they are marked `sync: false`. Those values are baked in at **build** time, so set them before
the first deploy — changing them later needs a rebuild, not just a restart.

Without the Firebase values the deploy still works; it serves the bundled `data/titles.json`.

## Data shape

Each document in `titles` (and each object in `data/titles.json`) looks like this:

```json
{
  "id": "kohrra-season-2",
  "title": "Kohrra Season 2",
  "type": "show",
  "year": 2026,
  "genres": ["Crime", "Drama"],
  "language": "Hindi",
  "platform": "Netflix",
  "releaseDate": "2026-08-14",
  "featured": false,
  "tagline": "New Season",
  "sections": ["editors-pick"],
  "synopsis": "…",
  "posterUrl": "https://…/poster.jpg"
}
```

- `id` is the slug and the Firestore document id.
- `sections` decides which home rows a title appears in: `talk-of-the-town`, `editors-pick`, `prime`, `crunchyroll`, `apple-tv`.
- `featured: true` puts a title in the hero carousel.
- `posterUrl` is optional. Without it the card draws a deterministic gradient poster from the id, so nothing renders as a broken image.

## Logo

The Rai emblem is a vector trace of the supplied artwork, kept at `public/logo.svg`. The same
file is also served as the favicon from `app/icon.svg`. Replace both to change the mark
everywhere; `components/Logo.tsx` only references the path.

The trace is clipped to a circle so the badge sits cleanly on any background — the corners of
the original square artwork are dropped rather than filled with black.

## Layout

```
app/            routes (home, browse, search, title/[slug], about, api/search)
components/     Header, Footer, Logo, HeroCarousel, Row, TitleCard, Poster
lib/            firebase.ts (config + client), content.ts (reads), sections.ts, poster.ts, types.ts
data/           titles.json — the seed catalogue
scripts/        seed.ts — Admin SDK seeder
firestore.rules public read, no client write
```

## Notes

- Posters are generated placeholders until real images are supplied; artwork and titles belong to their respective owners.
- Synopsis text in `data/titles.json` is written from public reporting on each title (release dates, cast, platform, ratings claims such as Tomatometer scores are quoted from those sources).
