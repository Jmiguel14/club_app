"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchApartment } from "@/lib/apartments-api";
import { AuthApiError } from "@/lib/auth-api";
import { queryKeys } from "@/lib/query-keys";

export function useApartmentQuery(id: number | null, enabled: boolean) {
  return useQuery({
    queryKey:
      id != null
        ? queryKeys.apartments.detail(id)
        : (["apartments", "disabled"] as const),
    queryFn: () => fetchApartment(id!),
    enabled: enabled && id != null,
    retry: (failureCount, error) => {
      if (error instanceof AuthApiError && error.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
