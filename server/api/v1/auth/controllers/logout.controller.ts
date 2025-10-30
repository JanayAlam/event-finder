import { Request, Response } from "express";
import {
  KINDE_DOMAIN,
  KINDE_LOGOUT_REDIRECT_URI
} from "../../../../settings/config";
import { COOKIE_KEYS, cookieOptions } from "../../../../settings/cookies";

export const logoutController = async (_req: Request, res: Response) => {
  Object.values(COOKIE_KEYS).forEach((key) =>
    res.clearCookie(key, cookieOptions)
  );
  res.redirect(
    `${KINDE_DOMAIN}/logout?redirect=${encodeURIComponent(KINDE_LOGOUT_REDIRECT_URI)}`
  );
};
