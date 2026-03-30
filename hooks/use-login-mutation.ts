"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { login } from "@/lib/auth-api";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/store/auth-store";

export function useLoginMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setSession(data.token, data.user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.me });
      router.replace("/dashboard");
    },
  });
}
