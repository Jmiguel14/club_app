"use client";

import Link from "next/link";

import { InvoiceEditor } from "@/components/invoices/invoice-editor";
import { ui } from "@/lib/i18n/ui";

export default function NewInvoicePage() {
  return (
    <div>
      <Link
        href="/dashboard/invoices"
        className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
      >
        {ui.invoices.newPageBack}
      </Link>
      <header className="mt-6 border-b border-white/10 pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--accent)]">
          {ui.invoices.newKicker}
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
          {ui.invoices.newTitle}
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{ui.invoices.newIntro}</p>
      </header>
      <div className="mt-8">
        <InvoiceEditor />
      </div>
    </div>
  );
}
