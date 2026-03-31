import { api } from "@/lib/api/client";
import { AuthApiError, errorsFromBody } from "@/lib/auth-api";
import { ui } from "@/lib/i18n/ui";
import type { Apartment, ApartmentInput } from "@/lib/types/apartment";

function assertOk(status: number, data: unknown, fallback: string): void {
  if (status >= 200 && status < 300) return;
  const errs = errorsFromBody(data, fallback);
  throw new AuthApiError(errs[0] ?? fallback, status, errs);
}

export async function fetchApartments(): Promise<Apartment[]> {
  const res = await api.get<Apartment[]>("/apartments");
  assertOk(res.status, res.data, ui.api.couldNotLoadRoster);
  return Array.isArray(res.data) ? res.data : [];
}

export async function fetchApartment(id: number): Promise<Apartment> {
  const res = await api.get<Apartment>(`/apartments/${id}`);
  assertOk(res.status, res.data, ui.api.couldNotLoadProfileItem);
  return res.data;
}

export async function createApartment(
  input: ApartmentInput,
): Promise<Apartment> {
  const res = await api.post<Apartment>("/apartments", {
    apartment: {
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim() || null,
    },
  });
  assertOk(res.status, res.data, ui.api.couldNotCreateProfile);
  return res.data;
}

export async function updateApartment(
  id: number,
  input: ApartmentInput,
): Promise<Apartment> {
  const res = await api.patch<Apartment>(`/apartments/${id}`, {
    apartment: {
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim() || null,
    },
  });
  assertOk(res.status, res.data, ui.api.couldNotUpdateProfile);
  return res.data;
}

export async function deleteApartment(id: number): Promise<void> {
  const res = await api.delete(`/apartments/${id}`);
  if (res.status === 204 || res.status === 200) return;
  assertOk(res.status, res.data, ui.api.couldNotRemoveProfile);
}
