"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { signup } from "@/lib/auth-api";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/store/auth-store";

export function useSignupMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      setSession(data.token, data.user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.me });
      router.replace("/dashboard");
    },
  });
}
