import type { InvoiceDetail, InvoiceLineDraft } from "@/lib/types/invoice";

/** Rails nested `invoice_details_attributes` with string keys. */
export function buildInvoiceDetailsAttributes(
  lines: InvoiceLineDraft[],
): Record<string, Record<string, unknown>> {
  const out: Record<string, Record<string, unknown>> = {};
  let i = 0;

  for (const line of lines) {
    if (line.destroy && line.persistedId != null) {
      out[String(i++)] = { id: line.persistedId, _destroy: "1" };
      continue;
    }
    if (line.destroy) continue;

    if (line.kind === "point") {
      out[String(i++)] = {
        ...(line.persistedId != null ? { id: line.persistedId } : {}),
        type: "point",
        label: line.label.trim(),
        quantity: line.quantity,
        point_cost: line.pointCost.trim() || "0",
      };
      continue;
    }

    const pid = line.productId === "" ? null : line.productId;
    out[String(i++)] = {
      ...(line.persistedId != null ? { id: line.persistedId } : {}),
      type: "product",
      product_id: pid,
      quantity: line.quantity,
      unit_price: line.unitPrice.trim() || "0",
    };
  }

  return out;
}

export function invoiceLineDraftsFromDetails(
  details: InvoiceDetail[] | undefined,
): InvoiceLineDraft[] {
  if (!details?.length) return [];
  return details.map((d) => ({
    key: `p-${d.id}`,
    persistedId: d.id,
    kind: d.type,
    quantity: d.quantity,
    productId: d.product_id ?? "",
    unitPrice: d.unit_price ?? "",
    pointCost: d.point_cost ?? "",
    label: d.label ?? "",
  }));
}
