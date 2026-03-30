import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(124,58,237,0.2),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-[40vh] w-[120%] -translate-x-1/2 rounded-[100%] bg-gradient-to-t from-violet-950/40 to-transparent blur-3xl"
        aria-hidden
      />
      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-[var(--accent)]">
          Venue ops
        </p>
        <h1
          className="mt-4 max-w-lg [font-family:var(--font-display)] text-5xl leading-none tracking-[0.12em] text-[var(--foreground)] sm:text-6xl"
        >
          CLUB FLOOR
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--muted)]">
          Management console for nightclubs — track what your team offers and
          what moves across the bar.
        </p>
        <div className="mt-12 flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-gradient-to-r from-[var(--accent-dim)] to-[var(--accent)] px-8 py-3.5 text-center text-sm font-semibold uppercase tracking-widest text-black shadow-[0_0_28px_-6px_var(--accent)] transition-opacity hover:opacity-95"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg border border-white/15 px-8 py-3.5 text-center text-sm font-semibold uppercase tracking-widest text-[var(--foreground)] transition-colors hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
          >
            Register
          </Link>
        </div>
      </main>
    </div>
  );
}
