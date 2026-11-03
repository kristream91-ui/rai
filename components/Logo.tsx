import Link from "next/link";

/**
 * The mark lives in public/logo.svg so it can be swapped without touching code.
 * Drop a new SVG at that path and it replaces the placeholder everywhere.
 */
export default function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Rai home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 rounded-md"
      />
      <span className="text-xl font-semibold tracking-[0.22em] text-white group-hover:text-brand">
        RAI
      </span>
    </Link>
  );
}
