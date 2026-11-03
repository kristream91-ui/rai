import Link from "next/link";
import TitleCard from "@/components/TitleCard";
import { getAllTitles, searchTitles } from "@/lib/content";

export const revalidate = 300;

export const metadata = {
  title: "Search",
  description: "Search the Rai catalogue of movies and shows.",
};

type SearchParams = Promise<{ q?: string }>;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const [results, all] = await Promise.all([searchTitles(query), getAllTitles()]);

  const suggestions = all.slice(0, 12);

  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-semibold text-white sm:text-3xl">Search</h1>

      <form action="/search" className="mt-5 flex gap-2">
        <label htmlFor="q" className="sr-only">
          Search query
        </label>
        <input
          id="q"
          name="q"
          defaultValue={query}
          placeholder="Try “Kohrra”, “anime”, “thriller”…"
          className="w-full rounded-full border border-line bg-panel px-5 py-3 text-sm text-white placeholder:text-muted focus:border-brand focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-ink hover:bg-brand/90"
        >
          Search
        </button>
      </form>

      {query ? (
        <p className="mt-5 text-sm text-muted">
          {results.length} result{results.length === 1 ? "" : "s"} for “{query}”
        </p>
      ) : null}

      {query && results.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-line/70 bg-panel/40 p-6">
          <p className="text-white">Nothing matched “{query}”.</p>
          <p className="mt-1 text-sm text-muted">
            Try a title, a genre, a platform or a language.
          </p>
        </div>
      ) : null}

      {results.length ? (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {results.map((title) => (
            <TitleCard key={title.id} title={title} />
          ))}
        </div>
      ) : null}

      {!query ? (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-white">Popular right now</h2>
          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {suggestions.map((title) => (
              <TitleCard key={title.id} title={title} />
            ))}
          </div>
          <p className="mt-8 text-sm text-muted">
            Or <Link href="/browse" className="text-brand hover:underline">browse the full catalogue</Link>.
          </p>
        </div>
      ) : null}
    </div>
  );
}
