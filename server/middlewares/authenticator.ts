import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../db";
import { serializeUserResponse } from "../serializers/user";
import { getRefreshTokenFromCache, saveRefreshToken } from "../services/token";
import {
  ACCESS_TOKEN_EXPIRATION_TIME_SECOND,
  ACCESS_TOKEN_JWT_SECRET,
  REFRESH_TOKEN_EXPIRATION_TIME_SECOND,
  REFRESH_TOKEN_JWT_SECRET
} from "../settings/config";
import { COOKIE_KEYS, cookieOptions } from "../settings/cookies";
import { TJWTPayload } from "../types/auth/auth-types";
import logger from "../utils/winston";

const sendUnauthorized = (res: Response) => {
  res.status(401).json({
    message: "Unauthorized"
  });
};

const refreshController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  const refreshToken: string | undefined =
    cookies[COOKIE_KEYS.authRefreshToken];

  const token = refreshToken?.replace("Bearer ", "");

  if (!token) {
    return sendUnauthorized(res);
  }

  try {
    const decodedUser = jwt.verify(token, REFRESH_TOKEN_JWT_SECRET) as
      | TJWTPayload
      | undefined;

    // get refresh token from redis
    const refreshTokenFromCache = await getRefreshTokenFromCache(
      decodedUser?.id
    );

    if (!decodedUser || !refreshTokenFromCache) {
      return sendUnauthorized(res);
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decodedUser.id
      }
    });

    if (!user) {
      return sendUnauthorized(res);
    }

    const tokenData: TJWTPayload = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    const accessJWT = jwt.sign(tokenData, ACCESS_TOKEN_JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRATION_TIME_SECOND
    });
    const accessTOken = "Bearer " + accessJWT;

    const refreshJWT = jwt.sign(tokenData, REFRESH_TOKEN_JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRATION_TIME_SECOND
    });
    const refreshToken = "Bearer " + refreshJWT;

    await saveRefreshToken(refreshJWT, user.id);

    req.user = user;

    res
      .cookie(COOKIE_KEYS.authAccessToken, accessTOken, cookieOptions)
      .cookie(COOKIE_KEYS.authRefreshToken, refreshToken, {
        ...cookieOptions,
        maxAge: REFRESH_TOKEN_EXPIRATION_TIME_SECOND
      })
      .cookie(COOKIE_KEYS.authUser, serializeUserResponse(user), cookieOptions);

    next();
  } catch (err) {
    return sendUnauthorized(res);
  }
};

const authProcessor = async (
  levels: string[],
  token: string,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenData: any = jwt.decode(token);

    if (!tokenData || !tokenData.id || !tokenData.role) {
      return sendUnauthorized(res);
    }

    const role = tokenData.role;

    if (levels.includes(role)) {
      let verified: string | JwtPayload | null = null;

      try {
        verified = jwt.verify(token, ACCESS_TOKEN_JWT_SECRET);
      } catch (err) {
        refreshController(req, res, next);
        return;
      }

      if (!verified) {
        refreshController(req, res, next);
        return;
      }

      const user = await prisma.user.findUnique({
        where: {
          id: (tokenData as User).id
        }
      });

      if (!user) {
        sendUnauthorized(res);
        return;
      }

      req.user = user;
      next();
    } else {
      return sendUnauthorized(res);
    }
  } catch (err) {
    logger.error("Auth processor error");
    logger.error(err);
    return sendUnauthorized(res);
  }
};

export const authenticator = (levels: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get authToken
      const cookies = req.cookies;
      const authToken: string | undefined =
        cookies[COOKIE_KEYS.authAccessToken] || req.headers["authorization"];

      if (!authToken) {
        sendUnauthorized(res);
        return;
      }

      // get token
      const token = authToken.replace("Bearer ", "");

      if (!token) {
        sendUnauthorized(res);
        return;
      }

      authProcessor(levels, token, req, res, next);
    } catch (err) {
      logger.error(err);
      sendUnauthorized(res);
      return;
    }
  };
};
