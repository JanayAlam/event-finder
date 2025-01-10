import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { redis } from "../../db";
import {
  ACCESS_TOKEN_EXPIRATION_TIME_SECOND,
  ACCESS_TOKEN_JWT_SECRET,
  REFRESH_TOKEN_EXPIRATION_TIME_SECOND,
  REFRESH_TOKEN_JWT_SECRET
} from "../../settings/config";
import { TJWTPayload } from "../../types/auth";
import { REDIS_KEY } from "../../types/enums/redis";
import logger from "../../utils/winston";

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

export const saveRefreshToken = async (
  refreshToken: string,
  userId: string
) => {
  try {
    const redisKey = `${REDIS_KEY.REFRESH_TOKEN}:${userId}`;
    await redis.set(redisKey, refreshToken);
    await redis.expire(redisKey, REFRESH_TOKEN_EXPIRATION_TIME_SECOND);
  } catch (err) {
    logger.error(err);
  }
};

export const getRefreshTokenFromCache = async (userId?: string) => {
  try {
    const redisKey = `${REDIS_KEY.REFRESH_TOKEN}:${userId}`;
    return redis.get(redisKey);
  } catch (err) {
    logger.error(err);
  }
};
