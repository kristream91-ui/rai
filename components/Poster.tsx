import { posterInitials, posterStyle } from "@/lib/poster";
import type { Title } from "@/lib/types";

interface PosterProps {
  title: Title;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_TEXT = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
};

/**
 * Renders the real poster when a title has one, otherwise a generated gradient card
 * with the title's initials. Generated cards are intentional, not broken images.
 */
export default function Poster({ title, className = "", size = "md" }: PosterProps) {
  if (title.posterUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={title.posterUrl}
        alt={`${title.title} poster`}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center ${className}`}
      style={posterStyle(title.id)}
      aria-hidden="true"
    >
      <span
        className={`${SIZE_TEXT[size]} font-semibold tracking-[0.18em] text-white/80 drop-shadow`}
      >
        {posterInitials(title.title)}
      </span>
      <span className="absolute bottom-2 right-2 rounded bg-black/40 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-white/70">
        {title.type === "movie" ? "Movie" : "Show"}
      </span>
    </div>
  );
}
