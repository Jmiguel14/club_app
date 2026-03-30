"use client";

import { useQuery } from "@tanstack/react-query";

import { AuthApiError } from "@/lib/auth-api";
import { fetchInvoices } from "@/lib/invoices-api";
import { queryKeys } from "@/lib/query-keys";

export function useInvoicesQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.invoices.all,
    queryFn: fetchInvoices,
    enabled,
    retry: (failureCount, error) => {
      if (error instanceof AuthApiError && error.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
