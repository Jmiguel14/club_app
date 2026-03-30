"use client";

import Link from "next/link";
import { useState } from "react";

import { ApartmentForm } from "@/components/apartments/apartment-form";
import { useCreateApartmentMutation } from "@/hooks/use-apartment-mutations";
import { toAuthApiError } from "@/lib/auth-api";
import type { ApartmentInput } from "@/lib/types/apartment";

const empty: ApartmentInput = { name: "", email: "", phone: "" };

export default function NewApartmentPage() {
  const createMutation = useCreateApartmentMutation();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: ApartmentInput) {
    setError(null);
    try {
      await createMutation.mutateAsync(values);
    } catch (err) {
      const e = toAuthApiError(err, "Could not create profile.");
      setError(e.errors.join(" ") || e.message);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Link
        href="/dashboard/apartments"
        className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
      >
        ← Back to roster
      </Link>
      <header className="mt-6 border-b border-white/10 pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--accent)]">
          New entry
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
          Add profile
        </h1>
      </header>
      <div className="mt-8 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]/60 p-8 backdrop-blur-sm">
        <ApartmentForm
          key="create"
          defaultValues={empty}
          onSubmit={handleSubmit}
          submitLabel={
            createMutation.isPending ? "Saving…" : "Create profile"
          }
          isSubmitting={createMutation.isPending}
          error={error}
        />
      </div>
    </div>
  );
}
