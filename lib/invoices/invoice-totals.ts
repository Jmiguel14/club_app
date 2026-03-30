import type { Invoice, InvoiceDetail, InvoiceLineDraft } from "@/lib/types/invoice";

export function detailLineTotal(d: InvoiceDetail): number {
  const q = d.quantity;
  if (d.type === "product") {
    return q * Number.parseFloat(d.unit_price ?? "0");
  }
  return q * Number.parseFloat(d.point_cost ?? "0");
}

export function invoiceGrandTotal(inv: Pick<Invoice, "invoice_details">): number {
  const lines = inv.invoice_details ?? [];
  return lines.reduce((sum, d) => sum + detailLineTotal(d), 0);
}

export function draftLineTotal(line: InvoiceLineDraft): number {
  const q = line.quantity;
  if (line.kind === "product") {
    return q * Number.parseFloat(line.unitPrice || "0");
  }
  return q * Number.parseFloat(line.pointCost || "0");
}
