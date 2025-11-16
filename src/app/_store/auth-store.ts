import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TUserResponse } from "../../../server/types/auth";

type TAuthState = {
  isInitialLoading: boolean;
  user: TUserResponse | null;
  isLoggedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
};

type TAuthActions = {
  setAuth: (
    user: TUserResponse | null,
    accessToken: string,
    refreshToken: string
  ) => void;
  clearAuth: () => void;
  initAuth: (
    user: TUserResponse | null,
    accessToken: string | null,
    refreshToken: string | null
  ) => void;
};

export type TAuthStore = TAuthState & TAuthActions;

const initialState: TAuthState = {
  isInitialLoading: true,
  user: null,
  isLoggedIn: false,
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
          isLoggedIn: !!(user && accessToken && refreshToken)
        });
      },

      setAuth: (user, accessToken, refreshToken) => {
        set({
          user,
          accessToken,
          refreshToken,
          isLoggedIn: true
        });
      },

      clearAuth: () => {
        set(initialState);
      }
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken
      }),
      onRehydrateStorage: () => {
        return async () => {
          try {
            const { data } = await axios.get("/api/auth", {
              withCredentials: true
            });

            useAuthStore.setState({
              user: data.user || null,
              isLoggedIn: !!(data.user && data.accessToken),
              accessToken: data.accessToken || null,
              refreshToken: data.refreshToken || null
            });
          } catch {
            useAuthStore.setState({
              user: null,
              isLoggedIn: false,
              accessToken: null,
              refreshToken: null
            });
          } finally {
            useAuthStore.setState({ isInitialLoading: false });
          }
        };
      }
    }
  )
);
