"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { posterStyle } from "@/lib/poster";
import type { Title } from "@/lib/types";

const ROTATE_MS = 6500;

export default function HeroCarousel({ titles }: { titles: Title[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (titles.length < 2) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % titles.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [titles.length]);

  if (!titles.length) return null;

  const active = titles[index];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-line/70">
      <div className="absolute inset-0" style={posterStyle(active.id)} />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/10" />

      <div className="relative flex min-h-[420px] flex-col justify-end gap-4 p-6 sm:min-h-[480px] sm:p-10">
        <p className="text-xs uppercase tracking-[0.3em] text-brand">
          {active.tagline ?? "Featured"}
        </p>
        <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-5xl">
          {active.title}
        </h1>
        <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <span>{active.type === "movie" ? "Movie" : "Show"}</span>
          <span aria-hidden="true">•</span>
          <span>{active.year}</span>
          <span aria-hidden="true">•</span>
          <span>{active.genres.slice(0, 3).join(", ")}</span>
          <span aria-hidden="true">•</span>
          <span className="text-white/80">{active.platform}</span>
        </p>
        <p className="max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
          {active.synopsis}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Link
            href={`/title/${active.id}`}
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brand/90"
          >
            View details
          </Link>
          <Link
            href="/browse"
            className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-medium text-white hover:border-white/60"
          >
            Browse everything
          </Link>
        </div>

        {titles.length > 1 ? (
          <div className="mt-4 flex items-center gap-2">
            {titles.map((title, dotIndex) => (
              <button
                key={title.id}
                type="button"
                onClick={() => setIndex(dotIndex)}
                aria-label={`Show ${title.title}`}
                aria-current={dotIndex === index}
                className={`h-1.5 rounded-full transition-all ${
                  dotIndex === index ? "w-8 bg-brand" : "w-3 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
