import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line/70 bg-panel/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold tracking-[0.22em] text-white">RAI</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Movies, shows and reviews — what to watch, where to watch it, and whether it
            is worth your evening.
          </p>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-medium text-white">Browse</p>
          <ul className="space-y-2 text-muted">
            <li>
              <Link href="/browse?type=movie" className="hover:text-white">
                Movies
              </Link>
            </li>
            <li>
              <Link href="/browse?type=show" className="hover:text-white">
                Shows
              </Link>
            </li>
            <li>
              <Link href="/browse?platform=Prime%20Video" className="hover:text-white">
                Prime Video
              </Link>
            </li>
            <li>
              <Link href="/browse?platform=Crunchyroll" className="hover:text-white">
                Crunchyroll
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-medium text-white">Rai</p>
          <ul className="space-y-2 text-muted">
            <li>
              <Link href="/about" className="hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-white">
                Search
              </Link>
            </li>
          </ul>
          <p className="mt-4 text-xs text-muted/70">
            © {new Date().getFullYear()} Rai. Titles and artwork belong to their respective
            owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
