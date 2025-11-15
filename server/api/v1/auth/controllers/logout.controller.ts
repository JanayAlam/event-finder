import { Request, Response } from "express";
import { PUBLIC_SERVER_URL } from "../../../../settings/config";
import { COOKIE_KEYS, cookieOptions } from "../../../../settings/cookies";

export const logoutController = async (_req: Request, res: Response) => {
  Object.values(COOKIE_KEYS).forEach((key) =>
    res.clearCookie(key, cookieOptions)
  );
  res.redirect(PUBLIC_SERVER_URL);
};
