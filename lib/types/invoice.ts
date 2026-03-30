import type { Apartment } from "@/lib/types/apartment";
import type { Product } from "@/lib/types/product";

export type InvoiceStatus = "draft" | "issued" | "paid" | "canceled";

export type InvoiceDetailType = "product" | "point";

export type InvoiceDetail = {
  id: number;
  invoice_id: number;
  type: InvoiceDetailType;
  product_id: number | null;
  quantity: number;
  unit_price: string | null;
  point_cost: string | null;
  label: string | null;
  product?: Product | null;
};

export type Invoice = {
  id: number;
  apartment_id: number;
  issued_on: string;
  status: InvoiceStatus;
  created_at?: string;
  updated_at?: string;
  apartment?: Apartment;
  invoice_details?: InvoiceDetail[];
};

/** Client-side line before mapping to Rails nested attributes */
export type InvoiceLineDraft = {
  key: string;
  persistedId?: number;
  kind: InvoiceDetailType;
  quantity: number;
  productId: number | "";
  unitPrice: string;
  pointCost: string;
  label: string;
  destroy?: boolean;
};
