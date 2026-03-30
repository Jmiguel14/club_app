"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { ApartmentForm } from "@/components/apartments/apartment-form";
import { useApartmentQuery } from "@/hooks/use-apartment-query";
import {
  useDeleteApartmentMutation,
  useUpdateApartmentMutation,
} from "@/hooks/use-apartment-mutations";
import { useUnauthorizedRedirect } from "@/hooks/use-unauthorized-redirect";
import { AuthApiError, toAuthApiError } from "@/lib/auth-api";
import type { ApartmentInput } from "@/lib/types/apartment";

export default function EditApartmentPage() {
  const params = useParams();
  const rawId = params.id;
  const id =
    typeof rawId === "string"
      ? Number.parseInt(rawId, 10)
      : Array.isArray(rawId)
        ? Number.parseInt(rawId[0] ?? "", 10)
        : NaN;
  const idValid = Number.isFinite(id) && id > 0;

  const apartmentQuery = useApartmentQuery(idValid ? id : null, idValid);
  const updateMutation = useUpdateApartmentMutation();
  const deleteMutation = useDeleteApartmentMutation();

  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useUnauthorizedRedirect(apartmentQuery.error);

  async function handleSubmit(values: ApartmentInput) {
    if (!idValid) return;
    setFormError(null);
    try {
      await updateMutation.mutateAsync({ id, input: values });
    } catch (err) {
      const e = toAuthApiError(err, "Could not update profile.");
      setFormError(e.errors.join(" ") || e.message);
    }
  }

  async function handleDelete() {
    if (!idValid) return;
    if (
      !window.confirm(
        "Remove this profile from the roster? This cannot be undone.",
      )
    ) {
      return;
    }
    setDeleteError(null);
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      const e = toAuthApiError(err, "Could not remove profile.");
      setDeleteError(e.errors.join(" ") || e.message);
    }
  }

  if (!idValid) {
    return (
      <div className="rounded-xl border border-red-500/25 bg-red-950/30 p-6 text-red-200">
        Invalid profile link.
        <Link href="/dashboard/apartments" className="ml-2 underline">
          Back to roster
        </Link>
      </div>
    );
  }

  if (apartmentQuery.isPending) {
    return (
      <div className="mx-auto max-w-md space-y-4">
        <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
        <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (apartmentQuery.isError) {
    return (
      <div className="rounded-xl border border-red-500/25 bg-red-950/30 p-6 text-red-200">
        {apartmentQuery.error instanceof AuthApiError
          ? apartmentQuery.error.errors.join(" ") ||
            apartmentQuery.error.message
          : "Could not load profile."}
        <div className="mt-4">
          <Link href="/dashboard/apartments" className="underline">
            Back to roster
          </Link>
        </div>
      </div>
    );
  }

  const a = apartmentQuery.data;
  if (!a) return null;

  const defaults: ApartmentInput = {
    name: a.name,
    email: a.email,
    phone: a.phone ?? "",
  };

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
          Edit entry
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
          {a.name}
        </h1>
      </header>
      <div className="mt-8 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]/60 p-8 backdrop-blur-sm">
        <ApartmentForm
          key={a.id}
          defaultValues={defaults}
          onSubmit={handleSubmit}
          submitLabel={
            updateMutation.isPending ? "Saving…" : "Save changes"
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
            {deleteMutation.isPending ? "Removing…" : "Remove from roster"}
          </button>
        </div>
      </div>
    </div>
  );
}
