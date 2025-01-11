import { OTP_TYPE } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../../../db";
import { serializeUserResponse } from "../../../../serializers/user";
import { verifyAndRemoveOTP } from "../../../../services/otp";
import {
  generateAccessAndRefreshToken,
  saveRefreshToken
} from "../../../../services/token";
import { REFRESH_TOKEN_EXPIRATION_TIME_SECOND } from "../../../../settings/config";
import { COOKIE_KEYS, cookieOptions } from "../../../../settings/cookies";
import {
  TCustomerEmailLoginRequest,
  TCustomerPhoneLoginRequest
} from "../../../../types/customer";

export const customerEmailLogin = async (
  req: Request<any, any, TCustomerEmailLoginRequest, any>,
  res: Response
) => {
  const { email, otp } = req.body;

  let user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    res.status(400).json({
      email: "User not found"
    });
    return;
  }

  const isVerified = await verifyAndRemoveOTP(
    OTP_TYPE.LOGIN_EMAIL_OTP,
    email,
    otp
  );

  if (!isVerified) {
    res.status(400).json({
      email: "OTP did not match or expired",
      otp: "OTP did not match or expired"
    });
    return;
  }

  const [accessToken, refreshToken] = generateAccessAndRefreshToken(user);

  await saveRefreshToken(refreshToken, user.id);

  const serializedUser = serializeUserResponse(user);

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

export const customerPhoneLogin = async (
  req: Request<any, any, TCustomerPhoneLoginRequest, any>,
  res: Response
) => {
  const { phone, otp } = req.body;

  let user = await prisma.user.findUnique({
    where: { phone }
  });

  if (!user) {
    res.status(400).json({
      phone: "User not found"
    });
    return;
  }

  const isVerified = await verifyAndRemoveOTP(
    OTP_TYPE.LOGIN_PHONE_OTP,
    phone,
    otp
  );

  if (!isVerified) {
    res.status(400).json({
      phone: "OTP did not match or expired",
      otp: "OTP did not match or expired"
    });
    return;
  }

  const [accessToken, refreshToken] = generateAccessAndRefreshToken(user);

  await saveRefreshToken(refreshToken, user.id);

  const serializedUser = serializeUserResponse(user);

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
