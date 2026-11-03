import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-brand">404</p>
      <h1 className="mt-3 text-2xl font-semibold text-white">This title isn&apos;t in the catalogue</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        The page you asked for does not exist. It may have been renamed, or the title has not
        been added yet.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brand/90"
        >
          Back home
        </Link>
        <Link
          href="/browse"
          className="rounded-full border border-line px-5 py-2.5 text-sm text-white hover:border-white/40"
        >
          Browse
        </Link>
      </div>
    </div>
  );
}
