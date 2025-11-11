import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getAuthorizationTokens } from "../../../../services/kinde";
import { getOrCreateUser } from "../../../../services/user";
import {
  ACCESS_TOKEN_EXPIRY,
  PUBLIC_SERVER_URL,
  REFRESH_TOKEN_EXPIRY
} from "../../../../settings/config";
import { COOKIE_KEYS, cookieOptions } from "../../../../settings/cookies";
import ApiError from "../../../../utils/api-error";

export const kindeCallbackController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code = req.query.code as string;
  const returnedState = req.query.state as string | undefined;
  const storedState = req.cookies?.[COOKIE_KEYS.oauthState] as
    | string
    | undefined;

  if (!code) {
    res.status(400).send("Missing code");
    return;
  }

  if (!returnedState || !storedState || returnedState !== storedState) {
    res.status(400).send("Invalid state");
    return;
  }

  try {
    const tokens = await getAuthorizationTokens(code);

    const decoded = jwt.decode(tokens.idToken) as JwtPayload;

    const { sub, email } = decoded;

    if (!sub || !email) {
      throw new ApiError(500, "Invalid JWT payload");
    }

    const user = await getOrCreateUser({
      kindeId: sub,
      email
    });

    res.cookie(COOKIE_KEYS.authAccessToken, tokens.accessToken, {
      ...cookieOptions,
      maxAge: ACCESS_TOKEN_EXPIRY * 1000
    });
    res.cookie(COOKIE_KEYS.authRefreshToken, tokens.refreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_TOKEN_EXPIRY * 1000
    });
    res.cookie(COOKIE_KEYS.authUser, JSON.stringify(user), cookieOptions);

    res.cookie(COOKIE_KEYS.oauthState, "", {
      ...cookieOptions,
      maxAge: 0,
      path: "/"
    });

    res.redirect(`${PUBLIC_SERVER_URL}/`);
  } catch (err) {
    next(err);
  }
};
