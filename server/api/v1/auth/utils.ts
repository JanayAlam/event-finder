import { User, USER_ROLE } from "@prisma/client";
import jwt from "jsonwebtoken";
import {
  ADMIN_ACCESS_TOKEN_EXPIRATION_TIME_SECOND,
  ADMIN_JWT_SECRET,
  ADMIN_REFRESH_TOKEN_EXPIRATION_TIME_SECOND,
  CUSTOMER_ACCESS_TOKEN_EXPIRATION_TIME_SECOND,
  CUSTOMER_JWT_SECRET,
  CUSTOMER_REFRESH_TOKEN_EXPIRATION_TIME_SECOND
} from "../../../settings/config";
import { TJWTPayload } from "../../../types/auth";

export const generateAccessAndRefreshToken = (user: User) => {
  const userPayload: TJWTPayload = {
    id: user.id,
    email: user.email,
    phone: user.phone,
    role: user.role
  };

  const secret =
    user.role === USER_ROLE.CUSTOMER ? CUSTOMER_JWT_SECRET : ADMIN_JWT_SECRET;
  const accessTokenExpireTime =
    user.role === USER_ROLE.CUSTOMER
      ? CUSTOMER_ACCESS_TOKEN_EXPIRATION_TIME_SECOND
      : ADMIN_ACCESS_TOKEN_EXPIRATION_TIME_SECOND;
  const refreshTokenExpireTime =
    user.role === USER_ROLE.CUSTOMER
      ? CUSTOMER_REFRESH_TOKEN_EXPIRATION_TIME_SECOND
      : ADMIN_REFRESH_TOKEN_EXPIRATION_TIME_SECOND;

  const accessToken = jwt.sign(userPayload, secret, {
    expiresIn: accessTokenExpireTime
  });

  const refreshToken = jwt.sign(userPayload, secret, {
    expiresIn: refreshTokenExpireTime
  });

  return [accessToken, refreshToken];
};

export const getUserWithoutPassword = (user: User) => {
  const { password: _, ...rest } = user;
  return rest;
};
