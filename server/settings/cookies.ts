import { CookieOptions } from "express";
import { NODE_ENV } from "./config";

export const COOKIE_KEYS = {
  authAccessToken: "bhalothaki.authAccessToken",
  authRefreshToken: "bhalothaki.authRefreshToken",
  authUser: "bhalothaki.user",
  guestId: "bhalothaki.guestId"
} as const;

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: NODE_ENV === "production" ? "none" : "lax"
};
