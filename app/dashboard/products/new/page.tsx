"use client";

import Link from "next/link";
import { useState } from "react";

import { ProductForm } from "@/components/products/product-form";
import { useCreateProductMutation } from "@/hooks/use-product-mutations";
import { toAuthApiError } from "@/lib/auth-api";
import { ui } from "@/lib/i18n/ui";
import type { ProductInput } from "@/lib/types/product";

const empty: ProductInput = {
  name: "",
  sku: "",
  price: "0",
  stock: 0,
};

export default function NewProductPage() {
  const createMutation = useCreateProductMutation();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: ProductInput) {
    setError(null);
    try {
      await createMutation.mutateAsync(values);
    } catch (err) {
      const e = toAuthApiError(err, ui.api.couldNotCreateProduct);
      setError(e.errors.join(" ") || e.message);
    }
  }

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
          {ui.products.newKicker}
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
          {ui.products.newTitle}
        </h1>
      </header>
      <div className="mt-8 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]/60 p-8 backdrop-blur-sm">
        <ProductForm
          key="create"
          defaultValues={empty}
          onSubmit={handleSubmit}
          submitLabel={
            createMutation.isPending
              ? ui.products.saving
              : ui.products.createSubmit
          }
          isSubmitting={createMutation.isPending}
          error={error}
        />
      </div>
    </div>
  );
}
