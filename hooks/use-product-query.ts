"use client";

import { useQuery } from "@tanstack/react-query";

import { AuthApiError } from "@/lib/auth-api";
import { fetchProduct } from "@/lib/products-api";
import { queryKeys } from "@/lib/query-keys";

export function useProductQuery(id: number | null, enabled: boolean) {
  return useQuery({
    queryKey:
      id != null
        ? queryKeys.products.detail(id)
        : (["products", "disabled"] as const),
    queryFn: () => fetchProduct(id!),
    enabled: enabled && id != null,
    retry: (failureCount, error) => {
      if (error instanceof AuthApiError && error.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
