"use client";

import Link from "next/link";

import { InvoiceEditor } from "@/components/invoices/invoice-editor";

export default function NewInvoicePage() {
  return (
    <div>
      <Link
        href="/dashboard/invoices"
        className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
      >
        ← Back to invoices
      </Link>
      <header className="mt-6 border-b border-white/10 pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--accent)]">
          New tab
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
          Create invoice
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Add bar products and point-based services on the same document.
        </p>
      </header>
      <div className="mt-8">
        <InvoiceEditor />
      </div>
    </div>
  );
}
