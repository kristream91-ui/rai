import Link from "next/link";
import TitleCard from "./TitleCard";
import type { Title } from "@/lib/types";

interface RowProps {
  heading: string;
  blurb?: string;
  titles: Title[];
  href?: string;
}

export default function Row({ heading, blurb, titles, href }: RowProps) {
  if (!titles.length) return null;

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">{heading}</h2>
          {blurb ? <p className="mt-1 text-sm text-muted">{blurb}</p> : null}
        </div>
        {href ? (
          <Link href={href} className="shrink-0 text-sm text-brand hover:underline">
            See all
          </Link>
        ) : null}
      </div>

      <div className="no-scrollbar row-scroll -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
        {titles.map((title) => (
          <TitleCard key={title.id} title={title} />
        ))}
      </div>
    </section>
  );
}
