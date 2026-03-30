import { api } from "@/lib/api/client";
import { AuthApiError, errorsFromBody } from "@/lib/auth-api";
import type { Product } from "@/lib/types/product";

function assertOk(status: number, data: unknown, fallback: string): void {
  if (status >= 200 && status < 300) return;
  const errs = errorsFromBody(data, fallback);
  throw new AuthApiError(errs[0] ?? fallback, status, errs);
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await api.get<Product[]>("/products");
  assertOk(res.status, res.data, "Could not load products");
  return Array.isArray(res.data) ? res.data : [];
}
