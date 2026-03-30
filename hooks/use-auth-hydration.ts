"use client";

import { useSyncExternalStore } from "react";

import { useAuthStore } from "@/store/auth-store";

export function useAuthHydration(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const unsub = useAuthStore.persist.onFinishHydration(() => {
        onStoreChange();
      });
      if (useAuthStore.persist.hasHydrated()) {
        queueMicrotask(onStoreChange);
      }
      return unsub;
    },
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}
