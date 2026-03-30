"use client";

import { useQuery } from "@tanstack/react-query";

import { AuthApiError } from "@/lib/auth-api";
import { fetchProducts } from "@/lib/products-api";
import { queryKeys } from "@/lib/query-keys";

export function useProductsQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.products.all,
    queryFn: fetchProducts,
    enabled,
    retry: (failureCount, error) => {
      if (error instanceof AuthApiError && error.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
