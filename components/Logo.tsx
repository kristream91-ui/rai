import Link from "next/link";

/**
 * The Rai emblem is a traced SVG at public/logo.svg, and the same file doubles as the
 * favicon through app/icon.svg. Replace either file to change the mark everywhere.
 */
export default function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center" aria-label="Rai — home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt=""
        width={40}
        height={40}
        className="h-9 w-9 rounded-full transition group-hover:brightness-110 sm:h-10 sm:w-10"
      />
      <span className="sr-only">Rai</span>
    </Link>
  );
}
