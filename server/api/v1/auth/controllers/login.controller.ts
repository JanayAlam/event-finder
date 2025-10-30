import crypto from "crypto";
import { Request, Response } from "express";
import {
  KINDE_CLIENT_ID,
  KINDE_DOMAIN,
  KINDE_REDIRECT_URI
} from "../../../../settings/config";
import { COOKIE_KEYS, cookieOptions } from "../../../../settings/cookies";

export const loginController = async (_req: Request, res: Response) => {
  const state = crypto.randomBytes(16).toString("hex");
  res.cookie(COOKIE_KEYS.oauthState, state, cookieOptions);

  const authorizeUrl = `${KINDE_DOMAIN}/oauth2/auth?client_id=${KINDE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    KINDE_REDIRECT_URI
  )}&response_type=code&scope=openid%20profile%20email%20offline&state=${state}`;

  res.redirect(authorizeUrl);
};
