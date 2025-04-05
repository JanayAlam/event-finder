"use server";

import { adminLoginApi } from "@/api/admin";
import { CommonApiError } from "@/app/_types/common/error";
import { handlePrivateApiError } from "@/utils/error-handlers";
import { cookies } from "next/headers";
import {
  COOKIE_KEYS,
  cookieOptions
} from "../../../../../server/settings/cookies";
import { TAdminLoginRequest } from "../../../../../server/types/admin";
import { TUserResponse } from "../../../../../server/types/auth";

type AdminLoginFormSubmitActionResponse = Promise<{
  user?: TUserResponse | null;
  error?: {
    message: string;
    status: number;
  };
}>;

export const adminLoginFormSubmitAction = async (
  requestBody: TAdminLoginRequest,
  logout: () => Promise<void>
): AdminLoginFormSubmitActionResponse => {
  try {
    const { data } = await adminLoginApi(requestBody);

    const cookieStore = await cookies();

    cookieStore.set({
      name: COOKIE_KEYS.authAccessToken,
      value: `Bearer ${data.accessToken}`,
      path: "/",
      ...cookieOptions
    });

    cookieStore.set({
      name: COOKIE_KEYS.authRefreshToken,
      value: `Bearer ${data.refreshToken}`,
      path: "/",
      ...cookieOptions
    });

    cookieStore.set({
      name: COOKIE_KEYS.authUser,
      value: JSON.stringify(data.user),
      path: "/",
      ...cookieOptions
    });

    return {
      user: data.user
    };
  } catch (err) {
    const { data, error, status } = handlePrivateApiError(
      err as CommonApiError,
      logout
    );
    return {
      error: {
        message: data?.message || error || "Could not login",
        status
      }
    };
  }
};
