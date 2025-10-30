import { CookieOptions } from "express";
import { NODE_ENV } from "./config";

export const COOKIE_KEYS = {
  authAccessToken: "trip-mate.authAccessToken",
  authRefreshToken: "trip-mate.authRefreshToken",
  authUser: "trip-mate.user",
  oauthState: "trip-mate.oauthState"
} as const;

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: NODE_ENV === "production" ? "none" : "lax"
};
