import Link from "next/link";
import Poster from "./Poster";
import type { Title } from "@/lib/types";

export default function TitleCard({ title }: { title: Title }) {
  return (
    <Link
      href={`/title/${title.id}`}
      className="group block w-[150px] shrink-0 sm:w-[168px]"
    >
      <div className="aspect-[2/3] overflow-hidden rounded-xl border border-line/80 bg-panel shadow-lg shadow-black/40 transition group-hover:-translate-y-1 group-hover:border-brand/60">
        <Poster title={title} className="transition duration-500 group-hover:scale-105" />
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-medium leading-snug text-white group-hover:text-brand">
        {title.title}
      </p>
      <p className="mt-0.5 text-xs text-muted">
        {title.type === "movie" ? "Movie" : "Show"} · {title.year}
      </p>
    </Link>
  );
}
