"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useLogoutMutation } from "@/hooks/use-logout-mutation";
import { useMeQuery } from "@/hooks/use-me-query";
import { useUnauthorizedRedirect } from "@/hooks/use-unauthorized-redirect";
import { AuthApiError } from "@/lib/auth-api";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logoutMutation = useLogoutMutation();

  const meQuery = useMeQuery(true);

  useUnauthorizedRedirect(meQuery.error);

  const displayEmail = meQuery.data?.email ?? user?.email;
  const profileLoading = meQuery.isPending && !meQuery.data;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="[font-family:var(--font-display)] text-3xl tracking-[0.15em] text-[var(--accent)]">
            CONTROL
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[var(--foreground)]">
            Control room
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {profileLoading ? (
              <span className="inline-block h-4 w-40 animate-pulse rounded bg-white/10" />
            ) : (
              displayEmail
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            logoutMutation.mutate(undefined, {
              onSettled: () => router.replace("/login"),
            })
          }
          disabled={logoutMutation.isPending}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)] disabled:opacity-50"
        >
          {logoutMutation.isPending ? "Signing out…" : "Sign out"}
        </button>
      </header>
      <section className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]/60 p-8 backdrop-blur-sm">
        {meQuery.isError &&
        meQuery.error instanceof AuthApiError &&
        meQuery.error.status !== 401 ? (
          <p className="text-red-300">
            Could not refresh your profile. You can still use the app or try
            again later.
          </p>
        ) : (
          <p className="text-[var(--muted)]">
            Manage your venue roster, services (points), and bar products from
            here. Start with the roster — each entry is a floor profile your
            team can bill against.
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard/apartments"
            className="inline-flex rounded-lg border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-5 py-2.5 text-sm font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/15"
          >
            Open roster
          </Link>
          <Link
            href="/dashboard/invoices"
            className="inline-flex rounded-lg border border-white/15 px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]/35"
          >
            Floor tabs
          </Link>
        </div>
      </section>
    </div>
  );
}
