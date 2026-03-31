"use client";

import { ui } from "@/lib/i18n/ui";
import type { ProductInput } from "@/lib/types/product";

const fieldClass =
  "w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition-[border-color,box-shadow] placeholder:text-white/25 focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent)]/25 disabled:opacity-50";

const labelClass =
  "block text-xs font-medium uppercase tracking-widest text-[var(--muted)]";

type ProductFormProps = {
  defaultValues: ProductInput;
  onSubmit: (values: ProductInput) => void;
  submitLabel: string;
  isSubmitting: boolean;
  error: string | null;
};

export function ProductForm({
  defaultValues,
  onSubmit,
  submitLabel,
  isSubmitting,
  error,
}: ProductFormProps) {
  const f = ui.products.productForm;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const priceRaw = String(fd.get("price") ?? "").trim();
    const stockRaw = String(fd.get("stock") ?? "").trim();
    const stock = Number.parseInt(stockRaw, 10);
    onSubmit({
      name: String(fd.get("name") ?? "").trim(),
      sku: String(fd.get("sku") ?? "").trim(),
      price: priceRaw,
      stock: Number.isFinite(stock) ? stock : 0,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="name" className={labelClass}>
          {f.name}
        </label>
        <input
          id="name"
          name="name"
          key={`${defaultValues.sku}-${defaultValues.name}`}
          defaultValue={defaultValues.name}
          required
          disabled={isSubmitting}
          autoComplete="off"
          className={fieldClass}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="sku" className={labelClass}>
          {f.sku}
        </label>
        <input
          id="sku"
          name="sku"
          key={`${defaultValues.sku}-sku`}
          defaultValue={defaultValues.sku}
          required
          disabled={isSubmitting}
          autoComplete="off"
          className={fieldClass}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="price" className={labelClass}>
          {f.price}
        </label>
        <input
          id="price"
          name="price"
          type="text"
          inputMode="decimal"
          key={`${defaultValues.sku}-price`}
          defaultValue={defaultValues.price}
          required
          disabled={isSubmitting}
          className={fieldClass}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="stock" className={labelClass}>
          {f.stock}
        </label>
        <input
          id="stock"
          name="stock"
          type="number"
          min={0}
          step={1}
          key={`${defaultValues.sku}-stock`}
          defaultValue={defaultValues.stock}
          required
          disabled={isSubmitting}
          className={fieldClass}
        />
      </div>
      {error ? (
        <p
          className="rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-gradient-to-r from-[var(--accent-dim)] to-[var(--accent)] py-3.5 text-sm font-semibold uppercase tracking-widest text-black shadow-[0_0_24px_-4px_var(--accent)] transition-opacity hover:opacity-95 disabled:opacity-50"
      >
        {submitLabel}
      </button>
    </form>
  );
}
