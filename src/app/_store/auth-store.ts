import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TUserRole } from "../../../server/enums/role.enum";

export type TUserFromTokenPayload = {
  id: string;
  email: string;
  role: TUserRole;
};

type TAuthState = {
  user: TUserFromTokenPayload | null;
  isAuthenticated: boolean;
  role: TUserRole | null;
  accessToken: string | null;
  refreshToken: string | null;
};

type TAuthActions = {
  setAuth: (
    user: TUserFromTokenPayload,
    accessToken: string,
    refreshToken: string
  ) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<TUserFromTokenPayload>) => void;
  initAuth: (
    user: TUserFromTokenPayload | null,
    accessToken: string | null,
    refreshToken: string | null
  ) => void;
};

export type TAuthStore = TAuthState & TAuthActions;

const initialState: TAuthState = {
  user: null,
  isAuthenticated: false,
  role: null,
  accessToken: null,
  refreshToken: null
};

export const useAuthStore = create<TAuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      initAuth: (user, accessToken, refreshToken) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: !!(user && accessToken && refreshToken),
          role: user?.role || null
        });
      },

      setAuth: (user, accessToken, refreshToken) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          role: user.role
        });
      },

      clearAuth: () => {
        set(initialState);
      },

      updateUser: (userUpdates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userUpdates } : null,
          role: userUpdates.role || state.role
        }));
      }
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        role: state.role
      })
    }
  )
);
