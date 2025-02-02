import { Outlet, User } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type AuthUser = User & {
  outlet?: Outlet | null;
};

interface AuthStoreStates {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isHydrated: boolean;
}

interface AuthStoreActions {
  finishHydration(): void;
}

const initialState: AuthStoreStates = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isHydrated: false
};

export const useAuthStore = create<AuthStoreStates & AuthStoreActions>()(
  persist(
    immer((set) => ({
      ...initialState,
      finishHydration() {
        set({
          isHydrated: true
        });
      }
    })),
    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) {
            state?.finishHydration();
          }
        };
      }
    }
  )
);
