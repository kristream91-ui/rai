import Link from "next/link";

export const metadata = {
  title: "About",
  description: "What Rai is, and how the catalogue is put together.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl animate-fade-up">
      <h1 className="text-2xl font-semibold text-white sm:text-3xl">About Rai</h1>

      <p className="mt-4 text-base leading-relaxed text-white/80">
        Rai is a movies and shows catalogue. It tracks what is worth watching right now —
        in theatres, on Prime Video, on Crunchyroll and on Apple TV — and puts the basics
        in one place: what it is, who made it, and where it is streaming.
      </p>

      <h2 className="mt-8 text-lg font-semibold text-white">How the catalogue works</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Every title is a document in a Firestore <code className="text-white">titles</code>{" "}
        collection. The seed file lives at <code className="text-white">data/titles.json</code>{" "}
        and is pushed to Firestore with <code className="text-white">npm run seed</code>. When
        Firebase environment variables are missing, the site reads that same JSON directly, so
        it runs locally with no setup.
      </p>

      <h2 className="mt-8 text-lg font-semibold text-white">Rows you will see</h2>
      <ul className="mt-2 space-y-2 text-sm text-muted">
        <li>
          <span className="text-white">Talk Of The Town</span> — what is being watched and
          argued about this week.
        </li>
        <li>
          <span className="text-white">Editor&apos;s Pick Of The Week</span> — the desk&apos;s own
          shortlist.
        </li>
        <li>
          <span className="text-white">Worth Watching on Prime / Crunchyroll / Apple TV</span> —
          one row per platform.
        </li>
      </ul>

      <h2 className="mt-8 text-lg font-semibold text-white">Posters</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Posters are drawn from each title&apos;s id until a real image is supplied. Add a{" "}
        <code className="text-white">posterUrl</code> field to a title and the card uses that
        image instead — no code change needed.
      </p>

      <p className="mt-8 text-sm text-muted">
        Questions or a correction?{" "}
        <Link href="/search" className="text-brand hover:underline">
          Search the catalogue
        </Link>{" "}
        or{" "}
        <Link href="/browse" className="text-brand hover:underline">
          browse everything
        </Link>
        .
      </p>
    </div>
  );
}
