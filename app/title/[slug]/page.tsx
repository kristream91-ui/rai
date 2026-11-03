import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Poster from "@/components/Poster";
import Row from "@/components/Row";
import { getAllTitles, getRelatedTitles, getTitleById } from "@/lib/content";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const titles = await getAllTitles();
  return titles.map((title) => ({ slug: title.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = await getTitleById(slug);

  if (!title) return { title: "Title not found" };

  return {
    title: title.title,
    description: title.synopsis.slice(0, 155),
  };
}

export default async function TitlePage({ params }: PageProps) {
  const { slug } = await params;
  const title = await getTitleById(slug);

  if (!title) notFound();

  const related = await getRelatedTitles(title);

  return (
    <div className="animate-fade-up">
      <nav className="text-xs text-muted">
        <Link href="/" className="hover:text-white">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/browse" className="hover:text-white">
          Browse
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white/70">{title.title}</span>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-[260px_1fr]">
        <div className="mx-auto w-[220px] md:mx-0 md:w-full">
          <div className="aspect-[2/3] overflow-hidden rounded-2xl border border-line/80 bg-panel shadow-2xl shadow-black/50">
            <Poster title={title} size="lg" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold leading-tight text-white sm:text-4xl">
            {title.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
            <span className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-widest text-white/80">
              {title.type === "movie" ? "Movie" : "Show"}
            </span>
            <span>{title.year}</span>
            <span aria-hidden="true">•</span>
            <span>{title.language}</span>
            {title.releaseDate ? (
              <>
                <span aria-hidden="true">•</span>
                <span>
                  Released{" "}
                  {new Date(title.releaseDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </>
            ) : null}
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            {title.synopsis}
          </p>

          <dl className="mt-6 grid max-w-lg grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-line/70 bg-panel/50 px-4 py-3">
              <dt className="text-xs uppercase tracking-widest text-muted">Where to watch</dt>
              <dd className="mt-1 text-white">{title.platform}</dd>
            </div>
            <div className="rounded-xl border border-line/70 bg-panel/50 px-4 py-3">
              <dt className="text-xs uppercase tracking-widest text-muted">Genres</dt>
              <dd className="mt-1 text-white">{title.genres.join(", ")}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/browse?platform=${encodeURIComponent(title.platform)}`}
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brand/90"
            >
              More on {title.platform}
            </Link>
            <Link
              href={`/browse?genre=${encodeURIComponent(title.genres[0] ?? "")}`}
              className="rounded-full border border-line px-5 py-2.5 text-sm text-white hover:border-white/40"
            >
              More {title.genres[0]}
            </Link>
          </div>
        </div>
      </div>

      <Row heading="More like this" titles={related} href="/browse" />
    </div>
  );
}
