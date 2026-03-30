"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useApartmentsQuery } from "@/hooks/use-apartments-query";
import {
  useCreateInvoiceMutation,
  useDeleteInvoiceMutation,
  useUpdateInvoiceMutation,
} from "@/hooks/use-invoice-mutations";
import { useInvoiceQuery } from "@/hooks/use-invoice-query";
import { useProductsQuery } from "@/hooks/use-products-query";
import { useUnauthorizedRedirect } from "@/hooks/use-unauthorized-redirect";
import { draftLineTotal } from "@/lib/invoices/invoice-totals";
import { invoiceLineDraftsFromDetails } from "@/lib/invoices/nested-details";
import { AuthApiError, toAuthApiError } from "@/lib/auth-api";
import type { Apartment } from "@/lib/types/apartment";
import type { Invoice, InvoiceLineDraft, InvoiceStatus } from "@/lib/types/invoice";
import type { Product } from "@/lib/types/product";

const fieldClass =
  "w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent)]/25 disabled:opacity-50";
const labelClass =
  "mb-2 block text-xs font-medium uppercase tracking-widest text-[var(--muted)]";

const STATUS_OPTIONS: InvoiceStatus[] = [
  "draft",
  "issued",
  "paid",
  "canceled",
];

function normalizeInvoiceStatus(raw: unknown): InvoiceStatus {
  if (
    raw === "draft" ||
    raw === "issued" ||
    raw === "paid" ||
    raw === "canceled"
  ) {
    return raw;
  }
  if (typeof raw === "number") {
    const s = STATUS_OPTIONS[raw];
    if (s) return s;
  }
  return "draft";
}

function newProductLine(products: Product[]): InvoiceLineDraft {
  const p = products[0];
  return {
    key: crypto.randomUUID(),
    kind: "product",
    quantity: 1,
    productId: p?.id ?? "",
    unitPrice: p?.price ?? "0",
    pointCost: "",
    label: "",
  };
}

function newPointLine(): InvoiceLineDraft {
  return {
    key: crypto.randomUUID(),
    kind: "point",
    quantity: 1,
    productId: "",
    unitPrice: "",
    pointCost: "",
    label: "",
  };
}

type InvoiceEditorFormProps = {
  invoiceId?: number;
  initialInvoice: Invoice | null;
  apartments: Apartment[];
  products: Product[];
};

function InvoiceEditorForm({
  invoiceId,
  initialInvoice,
  apartments,
  products,
}: InvoiceEditorFormProps) {
  const createMutation = useCreateInvoiceMutation();
  const updateMutation = useUpdateInvoiceMutation();
  const deleteMutation = useDeleteInvoiceMutation();

  const [apartmentId, setApartmentId] = useState<number | "">(
    () => initialInvoice?.apartment_id ?? "",
  );
  const [issuedOn, setIssuedOn] = useState(
    () =>
      initialInvoice?.issued_on ??
      new Date().toISOString().slice(0, 10),
  );
  const [status, setStatus] = useState<InvoiceStatus>(() =>
    normalizeInvoiceStatus(initialInvoice?.status),
  );
  const [lines, setLines] = useState<InvoiceLineDraft[]>(() => {
    if (!initialInvoice) return [];
    const mapped = invoiceLineDraftsFromDetails(initialInvoice.invoice_details);
    return mapped.length ? mapped : [];
  });
  const [formError, setFormError] = useState<string | null>(null);

  const visibleLines = useMemo(
    () => lines.filter((l) => !l.destroy),
    [lines],
  );

  const draftTotal = useMemo(
    () => visibleLines.reduce((s, l) => s + draftLineTotal(l), 0),
    [visibleLines],
  );

  function setProductForLine(key: string, productId: number | "") {
    const p = products.find((x) => x.id === productId);
    setLines((prev) =>
      prev.map((l) =>
        l.key === key
          ? {
              ...l,
              productId,
              unitPrice: p ? p.price : l.unitPrice,
            }
          : l,
      ),
    );
  }

  function updateLine(key: string, patch: Partial<InvoiceLineDraft>) {
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, ...patch } : l)),
    );
  }

  function removeLine(key: string) {
    setLines((prev) =>
      prev.flatMap((line) => {
        if (line.key !== key) return [line];
        if (line.persistedId != null) return [{ ...line, destroy: true }];
        return [];
      }),
    );
  }

  function validate(): string | null {
    if (apartmentId === "") return "Choose a roster profile.";
    if (!issuedOn.trim()) return "Set a date.";
    for (const line of visibleLines) {
      if (line.kind === "product") {
        if (line.productId === "") return "Each bar line needs a product.";
        if (line.quantity < 1) return "Quantity must be at least 1.";
      } else {
        if (!line.label.trim()) return "Each service line needs a label.";
        if (line.quantity < 1) return "Quantity must be at least 1.";
        if (!line.pointCost.trim() || Number.parseFloat(line.pointCost) < 0) {
          return "Service lines need a valid point value.";
        }
      }
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const v = validate();
    if (v) {
      setFormError(v);
      return;
    }

    const input = {
      apartmentId: Number(apartmentId),
      issuedOn: issuedOn.trim(),
      status,
      lines,
    };

    try {
      if (invoiceId == null) {
        await createMutation.mutateAsync(input);
      } else {
        await updateMutation.mutateAsync({ id: invoiceId, input });
      }
    } catch (err) {
      const er = toAuthApiError(err, "Could not save invoice.");
      setFormError(er.errors.join(" ") || er.message);
    }
  }

  async function handleDeleteInvoice() {
    if (invoiceId == null) return;
    if (
      !window.confirm(
        "Delete this invoice and all of its lines? This cannot be undone.",
      )
    ) {
      return;
    }
    setFormError(null);
    try {
      await deleteMutation.mutateAsync(invoiceId);
    } catch (err) {
      const er = toAuthApiError(err, "Could not delete invoice.");
      setFormError(er.errors.join(" ") || er.message);
    }
  }

  const submitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="apartment_id" className={labelClass}>
            Roster profile
          </label>
          <select
            id="apartment_id"
            required
            disabled={submitting}
            className={fieldClass}
            value={apartmentId === "" ? "" : String(apartmentId)}
            onChange={(e) =>
              setApartmentId(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
          >
            <option value="">Select…</option>
            {apartments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="issued_on" className={labelClass}>
            Date
          </label>
          <input
            id="issued_on"
            type="date"
            required
            disabled={submitting}
            className={fieldClass}
            value={issuedOn}
            onChange={(e) => setIssuedOn(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="status" className={labelClass}>
            Status
          </label>
          <select
            id="status"
            disabled={submitting}
            className={fieldClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
            Lines
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={submitting || products.length === 0}
              onClick={() =>
                setLines((prev) => [...prev, newProductLine(products)])
              }
              className="rounded-lg border border-white/15 px-3 py-2 text-xs font-medium uppercase tracking-wider text-[var(--foreground)] transition-colors hover:border-[var(--accent)]/40 disabled:opacity-40"
            >
              + Bar product
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => setLines((prev) => [...prev, newPointLine()])}
              className="rounded-lg border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-3 py-2 text-xs font-medium uppercase tracking-wider text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/15"
            >
              + Service (points)
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <p className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-4 text-sm text-amber-100/90">
            No products in the catalog yet. You can still add service (points)
            lines; add products in the API to use bar lines.
          </p>
        ) : null}

        {visibleLines.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            No lines yet. Add a bar product or a service line.
          </p>
        ) : (
          <ul className="space-y-4">
            {visibleLines.map((line) => (
              <li
                key={line.key}
                className="rounded-xl border border-white/10 bg-[var(--surface)]/40 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
                    {line.kind === "product"
                      ? "Bar product"
                      : "Service · points"}
                  </span>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => removeLine(line.key)}
                    className="text-xs text-red-300/90 hover:text-red-200"
                  >
                    Remove
                  </button>
                </div>
                {line.kind === "product" ? (
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-1">
                      <label className={labelClass}>Product</label>
                      <select
                        className={fieldClass}
                        disabled={submitting}
                        value={
                          line.productId === "" ? "" : String(line.productId)
                        }
                        onChange={(e) =>
                          setProductForLine(
                            line.key,
                            e.target.value === ""
                              ? ""
                              : Number(e.target.value),
                          )
                        }
                      >
                        <option value="">Select…</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (${p.price})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Qty</label>
                      <input
                        type="number"
                        min={1}
                        className={fieldClass}
                        disabled={submitting}
                        value={line.quantity}
                        onChange={(e) =>
                          updateLine(line.key, {
                            quantity: Math.max(
                              1,
                              Number.parseInt(e.target.value, 10) || 1,
                            ),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Unit price</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        className={fieldClass}
                        disabled={submitting}
                        value={line.unitPrice}
                        onChange={(e) =>
                          updateLine(line.key, { unitPrice: e.target.value })
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-1">
                      <label className={labelClass}>Service label</label>
                      <input
                        type="text"
                        className={fieldClass}
                        disabled={submitting}
                        placeholder="e.g. VIP host · stage"
                        value={line.label}
                        onChange={(e) =>
                          updateLine(line.key, { label: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Qty</label>
                      <input
                        type="number"
                        min={1}
                        className={fieldClass}
                        disabled={submitting}
                        value={line.quantity}
                        onChange={(e) =>
                          updateLine(line.key, {
                            quantity: Math.max(
                              1,
                              Number.parseInt(e.target.value, 10) || 1,
                            ),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Points (value)</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        className={fieldClass}
                        disabled={submitting}
                        value={line.pointCost}
                        onChange={(e) =>
                          updateLine(line.key, { pointCost: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}
                <p className="mt-3 text-right text-sm text-[var(--muted)]">
                  Line subtotal:{" "}
                  <span className="font-medium text-[var(--accent)]">
                    {draftLineTotal(line).toFixed(2)}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 text-right text-sm text-[var(--foreground)]">
          Draft total:{" "}
          <span className="text-lg font-semibold text-[var(--accent)]">
            {draftTotal.toFixed(2)}
          </span>
        </p>
      </section>

      {formError ? (
        <p
          className="rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-200"
          role="alert"
        >
          {formError}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-gradient-to-r from-[var(--accent-dim)] to-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-widest text-black shadow-[0_0_24px_-4px_var(--accent)] disabled:opacity-50"
        >
          {submitting
            ? "Saving…"
            : invoiceId == null
              ? "Create invoice"
              : "Save invoice"}
        </button>
        <Link
          href="/dashboard/invoices"
          className="inline-flex items-center rounded-lg border border-white/15 px-6 py-3 text-sm font-medium text-[var(--muted)] transition-colors hover:border-white/25 hover:text-[var(--foreground)]"
        >
          Cancel
        </Link>
        {invoiceId != null ? (
          <button
            type="button"
            disabled={submitting}
            onClick={handleDeleteInvoice}
            className="ml-auto rounded-lg border border-red-500/40 px-4 py-3 text-sm font-medium text-red-300 transition-colors hover:bg-red-950/30 disabled:opacity-50"
          >
            {deleteMutation.isPending ? "Deleting…" : "Delete invoice"}
          </button>
        ) : null}
      </div>
    </form>
  );
}

type InvoiceEditorProps = {
  invoiceId?: number;
};

export function InvoiceEditor({ invoiceId }: InvoiceEditorProps) {
  const apartmentsQuery = useApartmentsQuery(true);
  const productsQuery = useProductsQuery(true);
  const invoiceQuery = useInvoiceQuery(
    invoiceId ?? null,
    invoiceId != null,
  );

  useUnauthorizedRedirect(invoiceQuery.error);
  useUnauthorizedRedirect(apartmentsQuery.error);
  useUnauthorizedRedirect(productsQuery.error);

  const loadingDeps =
    apartmentsQuery.isPending ||
    productsQuery.isPending ||
    (invoiceId != null && invoiceQuery.isPending);

  if (loadingDeps) {
    return (
      <div className="space-y-4">
        <div className="h-10 animate-pulse rounded-lg bg-white/5" />
        <div className="h-48 animate-pulse rounded-xl bg-white/5" />
      </div>
    );
  }

  if (invoiceId != null && invoiceQuery.isError) {
    const err = invoiceQuery.error;
    return (
      <div className="rounded-xl border border-red-500/25 bg-red-950/30 p-6 text-red-200">
        {err instanceof AuthApiError
          ? err.errors.join(" ") || err.message
          : "Could not load invoice."}
        <div className="mt-4">
          <Link href="/dashboard/invoices" className="underline">
            Back to tabs
          </Link>
        </div>
      </div>
    );
  }

  if (invoiceId != null && !invoiceQuery.data) {
    return (
      <div className="space-y-4">
        <div className="h-10 animate-pulse rounded-lg bg-white/5" />
        <div className="h-48 animate-pulse rounded-xl bg-white/5" />
      </div>
    );
  }

  const apartments = apartmentsQuery.data ?? [];
  const products = productsQuery.data ?? [];
  const initialInvoice = invoiceId != null ? invoiceQuery.data! : null;

  return (
    <InvoiceEditorForm
      key={invoiceId ?? "new"}
      invoiceId={invoiceId}
      initialInvoice={initialInvoice}
      apartments={apartments}
      products={products}
    />
  );
}
