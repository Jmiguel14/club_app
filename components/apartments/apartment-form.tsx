"use client";

import type { ApartmentInput } from "@/lib/types/apartment";

const fieldClass =
  "w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition-[border-color,box-shadow] placeholder:text-white/25 focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent)]/25 disabled:opacity-50";

const labelClass =
  "block text-xs font-medium uppercase tracking-widest text-[var(--muted)]";

type ApartmentFormProps = {
  defaultValues: ApartmentInput;
  onSubmit: (values: ApartmentInput) => void;
  submitLabel: string;
  isSubmitting: boolean;
  error: string | null;
};

export function ApartmentForm({
  defaultValues,
  onSubmit,
  submitLabel,
  isSubmitting,
  error,
}: ApartmentFormProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmit({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="name" className={labelClass}>
          Display name
        </label>
        <input
          id="name"
          name="name"
          key={`${defaultValues.name}-${defaultValues.email}`}
          defaultValue={defaultValues.name}
          required
          disabled={isSubmitting}
          autoComplete="name"
          className={fieldClass}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          key={`${defaultValues.name}-${defaultValues.email}-email`}
          defaultValue={defaultValues.email}
          required
          disabled={isSubmitting}
          autoComplete="email"
          className={fieldClass}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="phone" className={labelClass}>
          Phone <span className="normal-case text-white/35">(optional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          key={`${defaultValues.name}-${defaultValues.email}-phone`}
          defaultValue={defaultValues.phone}
          disabled={isSubmitting}
          autoComplete="tel"
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
