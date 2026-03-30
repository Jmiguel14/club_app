"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AuthApiError } from "@/lib/auth-api";
import { useAuthStore } from "@/store/auth-store";

export function useUnauthorizedRedirect(error: unknown | null | undefined) {
  const router = useRouter();
  const clearSession = useAuthStore((s) => s.clearSession);

  useEffect(() => {
    if (!error) return;
    if (error instanceof AuthApiError && error.status === 401) {
      clearSession();
      router.replace("/login");
    }
  }, [error, clearSession, router]);
}
