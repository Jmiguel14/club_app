"use client";

import Link from "next/link";

import { useInvoicesQuery } from "@/hooks/use-invoices-query";
import { useUnauthorizedRedirect } from "@/hooks/use-unauthorized-redirect";
import { invoiceGrandTotal } from "@/lib/invoices/invoice-totals";
import { AuthApiError } from "@/lib/auth-api";

function formatDate(iso: string) {
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function InvoicesListPage() {
  const listQuery = useInvoicesQuery(true);

  useUnauthorizedRedirect(listQuery.error);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--accent)]">
            Floor tabs
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
            Invoices
          </h1>
          <p className="mt-1 max-w-lg text-sm text-[var(--muted)]">
            Combine roster profiles with bar products and point-based services
            on one tab. Totals are computed from line items.
          </p>
        </div>
        <Link
          href="/dashboard/invoices/new"
          className="rounded-lg bg-gradient-to-r from-[var(--accent-dim)] to-[var(--accent)] px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-black shadow-[0_0_20px_-6px_var(--accent)] transition-opacity hover:opacity-95"
        >
          New invoice
        </Link>
      </header>

      {listQuery.isPending ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl border border-white/5 bg-white/5"
            />
          ))}
        </div>
      ) : listQuery.isError ? (
        <div className="rounded-xl border border-red-500/25 bg-red-950/30 p-6 text-red-200">
          {listQuery.error instanceof AuthApiError
            ? listQuery.error.errors.join(" ") || listQuery.error.message
            : "Could not load invoices."}
        </div>
      ) : listQuery.data?.length === 0 ? (
        <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]/50 p-10 text-center">
          <p className="text-[var(--muted)]">No invoices yet.</p>
          <Link
            href="/dashboard/invoices/new"
            className="mt-4 inline-block text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Create the first tab
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-white/10 bg-black/30 text-xs uppercase tracking-widest text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Roster</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Lines</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {listQuery.data?.map((inv) => {
                const n = inv.invoice_details?.length ?? 0;
                const total = invoiceGrandTotal(inv);
                return (
                  <tr
                    key={inv.id}
                    className="border-b border-white/5 transition-colors hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3 text-[var(--foreground)]">
                      {formatDate(inv.issued_on)}
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground)]">
                      {inv.apartment?.name ?? `Profile #${inv.apartment_id}`}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-md border border-white/10 px-2 py-0.5 text-xs capitalize text-[var(--muted)]">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">{n}</td>
                    <td className="px-4 py-3 text-right font-medium text-[var(--accent)]">
                      {total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/invoices/${inv.id}/edit`}
                        className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
