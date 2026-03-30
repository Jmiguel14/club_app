"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchApartments } from "@/lib/apartments-api";
import { AuthApiError } from "@/lib/auth-api";
import { queryKeys } from "@/lib/query-keys";

export function useApartmentsQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.apartments.all,
    queryFn: fetchApartments,
    enabled,
    retry: (failureCount, error) => {
      if (error instanceof AuthApiError && error.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
