"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { ProductForm } from "@/components/products/product-form";
import { useProductQuery } from "@/hooks/use-product-query";
import {
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "@/hooks/use-product-mutations";
import { useUnauthorizedRedirect } from "@/hooks/use-unauthorized-redirect";
import { AuthApiError, toAuthApiError } from "@/lib/auth-api";
import { ui } from "@/lib/i18n/ui";
import type { ProductInput } from "@/lib/types/product";

export default function EditProductPage() {
  const params = useParams();
  const rawId = params.id;
  const id =
    typeof rawId === "string"
      ? Number.parseInt(rawId, 10)
      : Array.isArray(rawId)
        ? Number.parseInt(rawId[0] ?? "", 10)
        : NaN;
  const idValid = Number.isFinite(id) && id > 0;

  const productQuery = useProductQuery(idValid ? id : null, idValid);
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();

  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useUnauthorizedRedirect(productQuery.error);

  async function handleSubmit(values: ProductInput) {
    if (!idValid) return;
    setFormError(null);
    try {
      await updateMutation.mutateAsync({ id, input: values });
    } catch (err) {
      const e = toAuthApiError(err, ui.api.couldNotUpdateProduct);
      setFormError(e.errors.join(" ") || e.message);
    }
  }

  async function handleDelete() {
    if (!idValid) return;
    if (!window.confirm(ui.products.confirmDelete)) {
      return;
    }
    setDeleteError(null);
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      const e = toAuthApiError(err, ui.api.couldNotDeleteProduct);
      setDeleteError(e.errors.join(" ") || e.message);
    }
  }

  if (!idValid) {
    return (
      <div className="rounded-xl border border-red-500/25 bg-red-950/30 p-6 text-red-200">
        {ui.products.invalidLink}
        <Link href="/dashboard/products" className="ml-2 underline">
          {ui.products.backToListPlain}
        </Link>
      </div>
    );
  }

  if (productQuery.isPending) {
    return (
      <div className="mx-auto max-w-md space-y-4">
        <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
        <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (productQuery.isError) {
    return (
      <div className="rounded-xl border border-red-500/25 bg-red-950/30 p-6 text-red-200">
        {productQuery.error instanceof AuthApiError
          ? productQuery.error.errors.join(" ") ||
            productQuery.error.message
          : ui.products.loadProductError}
        <div className="mt-4">
          <Link href="/dashboard/products" className="underline">
            {ui.products.backToListPlain}
          </Link>
        </div>
      </div>
    );
  }

  const p = productQuery.data;
  if (!p) return null;

  const defaults: ProductInput = {
    name: p.name,
    sku: p.sku,
    price: String(p.price),
    stock: p.stock,
  };

  return (
    <div className="mx-auto max-w-md">
      <Link
        href="/dashboard/products"
        className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
      >
        {ui.products.backToList}
      </Link>
      <header className="mt-6 border-b border-white/10 pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--accent)]">
          {ui.products.editKicker}
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
          {p.name}
        </h1>
      </header>
      <div className="mt-8 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]/60 p-8 backdrop-blur-sm">
        <ProductForm
          key={p.id}
          defaultValues={defaults}
          onSubmit={handleSubmit}
          submitLabel={
            updateMutation.isPending
              ? ui.products.saving
              : ui.products.saveChanges
          }
          isSubmitting={updateMutation.isPending}
          error={formError}
        />
        <div className="mt-8 border-t border-white/10 pt-8">
          {deleteError ? (
            <p
              className="mb-4 rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-200"
              role="alert"
            >
              {deleteError}
            </p>
          ) : null}
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending || updateMutation.isPending}
            className="w-full rounded-lg border border-red-500/40 py-3 text-sm font-medium text-red-300 transition-colors hover:border-red-400 hover:bg-red-950/40 disabled:opacity-50"
          >
            {deleteMutation.isPending
              ? ui.products.removing
              : ui.products.deleteProduct}
          </button>
        </div>
      </div>
    </div>
  );
}
