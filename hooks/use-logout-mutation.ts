"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logout } from "@/lib/auth-api";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/store/auth-store";

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearSession();
      queryClient.removeQueries({ queryKey: queryKeys.me });
    },
  });
}
