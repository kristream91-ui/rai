import Link from "next/link";
import TitleCard from "@/components/TitleCard";
import { getAllGenres, getAllTitles } from "@/lib/content";
import { PLATFORMS, SECTIONS } from "@/lib/sections";
import type { Title } from "@/lib/types";

export const revalidate = 300;

export const metadata = {
  title: "Browse",
  description: "Browse every movie and show in the Rai catalogue by type, platform or genre.",
};

type SearchParams = Promise<{
  type?: string;
  platform?: string;
  genre?: string;
  section?: string;
  sort?: string;
}>;

const TYPE_OPTIONS = [
  { value: "", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "show", label: "Shows" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "title", label: "A–Z" },
];

function buildHref(
  current: Record<string, string | undefined>,
  patch: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();
  const merged = { ...current, ...patch };
  Object.entries(merged).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `/browse?${query}` : "/browse";
}

function filterTitles(
  titles: Title[],
  filters: { type?: string; platform?: string; genre?: string; section?: string },
): Title[] {
  return titles.filter((title) => {
    if (filters.type && title.type !== filters.type) return false;
    if (filters.platform && title.platform !== filters.platform) return false;
    if (filters.genre && !title.genres.includes(filters.genre)) return false;
    if (filters.section && !title.sections?.includes(filters.section)) return false;
    return true;
  });
}

export default async function BrowsePage({ searchParams }: { searchParams: SearchParams }) {
  const filters = await searchParams;
  const [all, genres] = await Promise.all([getAllTitles(), getAllGenres()]);

  let titles = filterTitles(all, filters);
  if (filters.sort === "title") {
    titles = [...titles].sort((a, b) => a.title.localeCompare(b.title));
  }

  const activeFilters = { ...filters };
  const pill = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm transition ${
      active
        ? "border-brand bg-brand text-ink"
        : "border-line bg-panel text-muted hover:border-white/40 hover:text-white"
    }`;

  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-semibold text-white sm:text-3xl">Browse</h1>
      <p className="mt-1 text-sm text-muted">
        {titles.length} of {all.length} titles
      </p>

      <div className="mt-6 space-y-4 rounded-2xl border border-line/70 bg-panel/40 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-20 text-xs uppercase tracking-widest text-muted">Type</span>
          {TYPE_OPTIONS.map((option) => (
            <Link
              key={option.value || "all"}
              href={buildHref(activeFilters, { type: option.value || undefined })}
              className={pill((filters.type ?? "") === option.value)}
            >
              {option.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="w-20 text-xs uppercase tracking-widest text-muted">Platform</span>
          <Link
            href={buildHref(activeFilters, { platform: undefined })}
            className={pill(!filters.platform)}
          >
            All
          </Link>
          {PLATFORMS.map((platform) => (
            <Link
              key={platform}
              href={buildHref(activeFilters, { platform })}
              className={pill(filters.platform === platform)}
            >
              {platform}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="w-20 text-xs uppercase tracking-widest text-muted">Genre</span>
          <Link
            href={buildHref(activeFilters, { genre: undefined })}
            className={pill(!filters.genre)}
          >
            All
          </Link>
          {genres.map((genre) => (
            <Link
              key={genre}
              href={buildHref(activeFilters, { genre })}
              className={pill(filters.genre === genre)}
            >
              {genre}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="w-20 text-xs uppercase tracking-widest text-muted">Row</span>
          <Link
            href={buildHref(activeFilters, { section: undefined })}
            className={pill(!filters.section)}
          >
            All
          </Link>
          {SECTIONS.map((section) => (
            <Link
              key={section.key}
              href={buildHref(activeFilters, { section: section.key })}
              className={pill(filters.section === section.key)}
            >
              {section.heading}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="w-20 text-xs uppercase tracking-widest text-muted">Sort</span>
          {SORT_OPTIONS.map((option) => (
            <Link
              key={option.value}
              href={buildHref(activeFilters, { sort: option.value })}
              className={pill((filters.sort ?? "newest") === option.value)}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      {titles.length ? (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {titles.map((title) => (
            <TitleCard key={title.id} title={title} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-lg text-white">Nothing matches those filters.</p>
          <Link href="/browse" className="mt-2 inline-block text-sm text-brand hover:underline">
            Clear all filters
          </Link>
        </div>
      )}
    </div>
  );
}
