import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createAuthSlice, type AuthSlice } from "@/store/slices/auth-slice";

/** Root store type — add more slices and merge them in `persist` below. */
export type ClubStore = AuthSlice;

export const useAuthStore = create<ClubStore>()(
  persist(
    (...args) => ({
      ...createAuthSlice(...args),
    }),
    {
      name: "club-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    },
  ),
);
