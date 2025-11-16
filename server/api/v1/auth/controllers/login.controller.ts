import crypto from "crypto";
import { Request, Response } from "express";
import { getAuthorizationUrl } from "../../../../services/kinde";
import { COOKIE_KEYS, cookieOptions } from "../../../../settings/cookies";

export const loginController = async (_req: Request, res: Response) => {
  const state = crypto.randomBytes(16).toString("hex");
  res.cookie(COOKIE_KEYS.oauthState, state, cookieOptions);

  const authorizeUrl = getAuthorizationUrl(state);
  res.redirect(authorizeUrl);
};
