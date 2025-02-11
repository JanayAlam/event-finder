import { Outlet } from "@prisma/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { TUserResponse } from "../../server/types/auth";

type AuthUser = TUserResponse & {
  outlet?: Outlet | null;
};

interface AuthStoreStates {
  user: AuthUser | null;
}

interface AuthStoreActions {
  setUser: (user: AuthUser | null) => void;
}

const initialState: AuthStoreStates = {
  user: null
};

export const useAuthStore = create<AuthStoreStates & AuthStoreActions>()(
  persist(
    immer((set, _get) => ({
      ...initialState,
      setUser(user) {
        set({
          user: user
        });
      }
    })),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
      partialize(state) {
        return { user: state.user };
      }
    }
  )
);
