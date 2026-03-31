"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { InvoiceEditor } from "@/components/invoices/invoice-editor";
import { ui } from "@/lib/i18n/ui";

export default function EditInvoicePage() {
  const params = useParams();
  const raw = params.id;
  const idStr = typeof raw === "string" ? raw : raw?.[0];
  const id = idStr ? Number.parseInt(idStr, 10) : NaN;
  const idValid = Number.isFinite(id) && id > 0;

  if (!idValid) {
    return (
      <div className="rounded-xl border border-red-500/25 bg-red-950/30 p-6 text-red-200">
        {ui.invoices.invalid}
        <Link href="/dashboard/invoices" className="ml-2 underline">
          {ui.invoices.back}
        </Link>
      </div>
    );
  }

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
          {ui.invoices.editKicker}
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
          {ui.invoices.editTitle(id)}
        </h1>
      </header>
      <div className="mt-8">
        <InvoiceEditor invoiceId={id} />
      </div>
    </div>
  );
}
