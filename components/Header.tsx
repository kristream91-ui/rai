import Link from "next/link";
import Logo from "./Logo";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/about", label: "About" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Logo />

        <nav className="ml-2 hidden items-center gap-5 text-sm text-muted sm:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <form action="/search" className="ml-auto flex w-full max-w-xs items-center gap-2">
          <label htmlFor="site-search" className="sr-only">
            Search movies and shows
          </label>
          <input
            id="site-search"
            type="search"
            name="q"
            placeholder="Search movies, shows…"
            className="w-full rounded-full border border-line bg-panel px-4 py-2 text-sm text-white placeholder:text-muted focus:border-brand focus:outline-none"
          />
        </form>
      </div>
    </header>
  );
}
