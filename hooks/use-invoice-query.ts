"use client";

import { useQuery } from "@tanstack/react-query";

import { AuthApiError } from "@/lib/auth-api";
import { fetchInvoice } from "@/lib/invoices-api";
import { queryKeys } from "@/lib/query-keys";

export function useInvoiceQuery(id: number | null, enabled: boolean) {
  return useQuery({
    queryKey:
      id != null
        ? queryKeys.invoices.detail(id)
        : (["invoices", "disabled"] as const),
    queryFn: () => fetchInvoice(id!),
    enabled: enabled && id != null,
    staleTime: 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof AuthApiError && error.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
