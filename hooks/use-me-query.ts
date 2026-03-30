"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { AuthApiError, fetchCurrentUser } from "@/lib/auth-api";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/store/auth-store";

export function useMeQuery(enabled: boolean) {
  const token = useAuthStore((s) => s.token);
  const setSession = useAuthStore((s) => s.setSession);

  const query = useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchCurrentUser,
    enabled,
    retry: (failureCount, error) => {
      if (error instanceof AuthApiError && error.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });

  useEffect(() => {
    if (!query.data || !token) return;
    setSession(token, query.data);
  }, [query.data, token, setSession]);

  return query;
}
