import { api } from "@/lib/api/client";
import { AuthApiError, errorsFromBody } from "@/lib/auth-api";
import { ui } from "@/lib/i18n/ui";
import type { Product, ProductInput } from "@/lib/types/product";

function assertOk(status: number, data: unknown, fallback: string): void {
  if (status >= 200 && status < 300) return;
  const errs = errorsFromBody(data, fallback);
  throw new AuthApiError(errs[0] ?? fallback, status, errs);
}

function productPayload(input: ProductInput) {
  const price = Number.parseFloat(String(input.price).replace(",", "."));
  const stock = Number.isFinite(input.stock)
    ? Math.trunc(input.stock)
    : Number.parseInt(String(input.stock), 10) || 0;
  return {
    name: input.name.trim(),
    sku: input.sku.trim(),
    price: Number.isFinite(price) ? price : 0,
    stock,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await api.get<Product[]>("/products");
  assertOk(res.status, res.data, ui.api.couldNotLoadProducts);
  return Array.isArray(res.data) ? res.data : [];
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await api.get<Product>(`/products/${id}`);
  assertOk(res.status, res.data, ui.api.couldNotLoadProduct);
  return res.data;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const res = await api.post<Product>("/products", {
    product: productPayload(input),
  });
  assertOk(res.status, res.data, ui.api.couldNotCreateProduct);
  return res.data;
}

export async function updateProduct(
  id: number,
  input: ProductInput,
): Promise<Product> {
  const res = await api.patch<Product>(`/products/${id}`, {
    product: productPayload(input),
  });
  assertOk(res.status, res.data, ui.api.couldNotUpdateProduct);
  return res.data;
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await api.delete(`/products/${id}`);
  if (res.status === 204 || res.status === 200) return;
  assertOk(res.status, res.data, ui.api.couldNotDeleteProduct);
}
