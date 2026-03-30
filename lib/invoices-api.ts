import { api } from "@/lib/api/client";
import { AuthApiError, errorsFromBody } from "@/lib/auth-api";
import { buildInvoiceDetailsAttributes } from "@/lib/invoices/nested-details";
import type { Invoice, InvoiceLineDraft, InvoiceStatus } from "@/lib/types/invoice";

function assertOk(status: number, data: unknown, fallback: string): void {
  if (status >= 200 && status < 300) return;
  const errs = errorsFromBody(data, fallback);
  throw new AuthApiError(errs[0] ?? fallback, status, errs);
}

export type InvoiceUpsertInput = {
  apartmentId: number;
  issuedOn: string;
  status: InvoiceStatus;
  lines: InvoiceLineDraft[];
};

function bodyFromInput(input: InvoiceUpsertInput) {
  return {
    invoice: {
      apartment_id: input.apartmentId,
      issued_on: input.issuedOn,
      status: input.status,
      invoice_details_attributes: buildInvoiceDetailsAttributes(input.lines),
    },
  };
}

export async function fetchInvoices(): Promise<Invoice[]> {
  const res = await api.get<Invoice[]>("/invoices");
  assertOk(res.status, res.data, "Could not load invoices");
  return Array.isArray(res.data) ? res.data : [];
}

export async function fetchInvoice(id: number): Promise<Invoice> {
  const res = await api.get<Invoice>(`/invoices/${id}`);
  assertOk(res.status, res.data, "Could not load invoice");
  return res.data;
}

export async function createInvoice(input: InvoiceUpsertInput): Promise<Invoice> {
  const res = await api.post<Invoice>("/invoices", bodyFromInput(input));
  assertOk(res.status, res.data, "Could not create invoice");
  return res.data;
}

export async function updateInvoice(
  id: number,
  input: InvoiceUpsertInput,
): Promise<Invoice> {
  const res = await api.patch<Invoice>(`/invoices/${id}`, bodyFromInput(input));
  assertOk(res.status, res.data, "Could not update invoice");
  return res.data;
}

export async function deleteInvoice(id: number): Promise<void> {
  const res = await api.delete(`/invoices/${id}`);
  if (res.status === 204 || res.status === 200) return;
  assertOk(res.status, res.data, "Could not delete invoice");
}
