"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types/entities";
import { authApi, usersApi } from "../lib/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: user !== null }),

      fetchMe: async () => {
        set({ isLoading: true });
        try {
          const user = await usersApi.getMe();
          set({ user, isAuthenticated: true });
        } catch {
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          set({ user: null, isAuthenticated: false });
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      },

      clearAuth: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "dc-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
