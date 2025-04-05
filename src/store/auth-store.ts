import { logoutApi } from "@/api/auth";
import { CommonApiError } from "@/app/_types/common/error";
import { handlePrivateApiError } from "@/utils/error-handlers";
import { Outlet, USER_ROLE } from "@prisma/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import toast from "react-hot-toast";
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
  logout: (router?: AppRouterInstance) => Promise<void>;
}

const initialState: AuthStoreStates = {
  user: null
};

export const useAuthStore = create<AuthStoreStates & AuthStoreActions>()(
  persist(
    immer((set, get) => ({
      ...initialState,
      setUser(user) {
        set({ user });
      },
      logout: async (router?: AppRouterInstance) => {
        try {
          const user = get().user;

          await logoutApi();
          set({ user: null });

          if (!router) return;

          if (user?.role !== USER_ROLE.CUSTOMER) {
            router.push("/admin/login");
          } else {
            router.push("/login");
          }
        } catch (err) {
          const { data, error } = handlePrivateApiError(err as CommonApiError);
          toast.error(data?.message || error || "Could not logout");
        }
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
