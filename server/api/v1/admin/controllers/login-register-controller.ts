import { Request, Response } from "express";
import { serializeUserResponse } from "../../../../serializers/user";
import { generateAccessAndRefreshToken } from "../../../../services/token";
import { REFRESH_TOKEN_EXPIRATION_TIME_SECOND } from "../../../../settings/config";
import { COOKIE_KEYS, cookieOptions } from "../../../../settings/cookies";

export const superAdminRegisterHandler = async (
  req: Request<any, any, any, any>,
  res: Response
) => {
  const { email, phone, password } = req.body;

  res.status(200).json({});
};

export const adminLoginHandler = async (
  req: Request<any, any, any, any>,
  res: Response
) => {
  const { email, phone, password } = req.body;

  if (!email && !phone) {
    res.status(400).json({
      email: "Either email or phone is required",
      phone: "Either email or phone is required"
    });
    return;
  }

  const [accessToken, refreshToken] = generateAccessAndRefreshToken({});

  const serializedUser = serializeUserResponse({});

  res
    .status(200)
    .cookie(COOKIE_KEYS.authAccessToken, `Bearer ${accessToken}`, cookieOptions)
    .cookie(COOKIE_KEYS.authRefreshToken, `Bearer ${refreshToken}`, {
      ...cookieOptions,
      maxAge: REFRESH_TOKEN_EXPIRATION_TIME_SECOND * 1000
    })
    .cookie(COOKIE_KEYS.authUser, serializedUser, cookieOptions)
    .json({
      user: serializedUser,
      accessToken,
      refreshToken
    });
};
