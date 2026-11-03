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

The mark is `public/logo.svg`. Replace that one file to change the logo everywhere; `components/Logo.tsx` only references the path.

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
