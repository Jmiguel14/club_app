import type { Invoice, InvoiceDetail, InvoiceLineDraft } from "@/lib/types/invoice";

/** Magnitude always ≥ 0: qty × unit_price (product) or qty × point_cost (point). */
export function detailLineMagnitude(d: InvoiceDetail): number {
  const q = d.quantity;
  if (d.type === "product") {
    return q * Number.parseFloat(d.unit_price ?? "0");
  }
  return q * Number.parseFloat(d.point_cost ?? "0");
}

/**
 * Club owes the apartment for point-based services (+).
 * Bar products are consumption deducted from that balance (−).
 */
export function detailSignedContribution(d: InvoiceDetail): number {
  return d.type === "product"
    ? -detailLineMagnitude(d)
    : detailLineMagnitude(d);
}

export function invoiceGrandTotal(inv: Pick<Invoice, "invoice_details">): number {
  const lines = inv.invoice_details ?? [];
  return lines.reduce((sum, d) => sum + detailSignedContribution(d), 0);
}

/** Magnitude always ≥ 0 for a draft line. */
export function draftLineMagnitude(line: InvoiceLineDraft): number {
  const q = line.quantity;
  if (line.kind === "product") {
    return q * Number.parseFloat(line.unitPrice || "0");
  }
  return q * Number.parseFloat(line.pointCost || "0");
}

export function draftSignedContribution(line: InvoiceLineDraft): number {
  return line.kind === "product"
    ? -draftLineMagnitude(line)
    : draftLineMagnitude(line);
}
