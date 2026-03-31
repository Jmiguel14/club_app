"use client";

import Link from "next/link";

import { useProductsQuery } from "@/hooks/use-products-query";
import { useUnauthorizedRedirect } from "@/hooks/use-unauthorized-redirect";
import { AuthApiError } from "@/lib/auth-api";
import { ui } from "@/lib/i18n/ui";

export default function ProductsListPage() {
  const listQuery = useProductsQuery(true);

  useUnauthorizedRedirect(listQuery.error);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--accent)]">
            {ui.products.listKicker}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
            {ui.products.listTitle}
          </h1>
          <p className="mt-1 max-w-lg text-sm text-[var(--muted)]">
            {ui.products.listIntro}
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="rounded-lg bg-gradient-to-r from-[var(--accent-dim)] to-[var(--accent)] px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-black shadow-[0_0_20px_-6px_var(--accent)] transition-opacity hover:opacity-95"
        >
          {ui.products.addProduct}
        </Link>
      </header>

      {listQuery.isPending ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl border border-white/5 bg-white/5"
            />
          ))}
        </div>
      ) : listQuery.isError ? (
        <div className="rounded-xl border border-red-500/25 bg-red-950/30 p-6 text-red-200">
          {listQuery.error instanceof AuthApiError
            ? listQuery.error.errors.join(" ") || listQuery.error.message
            : ui.products.loadError}
        </div>
      ) : listQuery.data?.length === 0 ? (
        <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]/50 p-10 text-center">
          <p className="text-[var(--muted)]">{ui.products.empty}</p>
          <Link
            href="/dashboard/products/new"
            className="mt-4 inline-block text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
          >
            {ui.products.addFirst}
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {listQuery.data?.map((p) => (
            <li key={p.id}>
              <Link
                href={`/dashboard/products/${p.id}/edit`}
                className="flex flex-col gap-1 rounded-xl border border-white/10 bg-[var(--surface)]/40 p-5 transition-colors hover:border-[var(--accent)]/30 hover:bg-[var(--surface)]/70 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-[var(--foreground)]">
                    {p.name}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    {p.sku} · {p.price} · {p.stock} {ui.products.stockUnits}
                  </p>
                </div>
                <span className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">
                  {ui.products.editLink}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
