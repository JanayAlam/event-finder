import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { z } from "zod";
import { RefreshAccessTokenDtoSchema } from "../../../../../validation-schemas/auth-schemas";
import { refreshAccessToken } from "../../../../services/kinde";
import { getUser } from "../../../../services/user";
import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY
} from "../../../../settings/config";
import { COOKIE_KEYS, cookieOptions } from "../../../../settings/cookies";
import ApiError from "../../../../utils/api-error";

type TRefreshAccessTokenRequestBodyDto = z.infer<
  typeof RefreshAccessTokenDtoSchema
>;

export const refreshAccessTokenController = async (
  req: Request<unknown, unknown, TRefreshAccessTokenRequestBodyDto>,
  res: Response
) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token not found");
  }

  const tokens = await refreshAccessToken(refreshToken);

  const decoded = jwt.decode(tokens.idToken) as JwtPayload;

  const { sub, email } = decoded;

  if (!sub || !email) {
    throw new ApiError(500, "Invalid JWT payload");
  }

  const user = await getUser({
    kindeId: sub,
    email
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.cookie(COOKIE_KEYS.authAccessToken, tokens.accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_EXPIRY * 1000
  });
  res.cookie(COOKIE_KEYS.authRefreshToken, tokens.refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_EXPIRY * 1000
  });
  res.cookie(COOKIE_KEYS.authUser, JSON.stringify(user), cookieOptions);

  res.status(200).json({
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken
  });
};
