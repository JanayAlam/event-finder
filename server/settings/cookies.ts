import { CookieOptions } from "express";
import { NODE_ENV } from "./config";

export const COOKIE_KEYS = {
  authAccessToken: "event-finder.authAccessToken",
  authRefreshToken: "event-finder.authRefreshToken",
  authUser: "event-finder.user",
  oauthState: "event-finder.oauthState"
} as const;

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: NODE_ENV === "production" ? "none" : "lax"
};
