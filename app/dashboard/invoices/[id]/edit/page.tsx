"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { InvoiceEditor } from "@/components/invoices/invoice-editor";

export default function EditInvoicePage() {
  const params = useParams();
  const raw = params.id;
  const idStr = typeof raw === "string" ? raw : raw?.[0];
  const id = idStr ? Number.parseInt(idStr, 10) : NaN;
  const idValid = Number.isFinite(id) && id > 0;

  if (!idValid) {
    return (
      <div className="rounded-xl border border-red-500/25 bg-red-950/30 p-6 text-red-200">
        Invalid invoice.
        <Link href="/dashboard/invoices" className="ml-2 underline">
          Back
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
        ← Back to invoices
      </Link>
      <header className="mt-6 border-b border-white/10 pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--accent)]">
          Edit tab
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
          Invoice #{id}
        </h1>
      </header>
      <div className="mt-8">
        <InvoiceEditor invoiceId={id} />
      </div>
    </div>
  );
}
