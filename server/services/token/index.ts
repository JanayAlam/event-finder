import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRATION_TIME_SECOND,
  ACCESS_TOKEN_JWT_SECRET,
  REFRESH_TOKEN_EXPIRATION_TIME_SECOND,
  REFRESH_TOKEN_JWT_SECRET
} from "../../settings/config";
import { TJWTPayload } from "../../types/auth";

export const generateAccessAndRefreshToken = (user: User) => {
  const userPayload: TJWTPayload = {
    id: user.id,
    email: user.email,
    phone: user.phone,
    role: user.role
  };

  const accessToken = jwt.sign(userPayload, ACCESS_TOKEN_JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME_SECOND
  });

  const refreshToken = jwt.sign(userPayload, REFRESH_TOKEN_JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION_TIME_SECOND
  });

  return [accessToken, refreshToken];
};
