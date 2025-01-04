import { User, USER_ROLE } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { CookieOptions } from "express-serve-static-core";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../db";
import {
  ADMIN_ACCESS_TOKEN_EXPIRATION_TIME_SECOND,
  ADMIN_JWT_SECRET,
  CUSTOMER_JWT_SECRET,
  CUSTOMER_REFRESH_TOKEN_EXPIRATION_TIME_SECOND,
  NODE_ENV
} from "../settings/config";
import COOKIE_KEYS from "../settings/cookies-keys";
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
  const refreshToken = cookies[COOKIE_KEYS.authRefreshToken];

  if (!refreshToken) {
    return sendUnauthorized(res);
  }

  const token = refreshToken.split(" ")[1];

  try {
    const decodedUser = jwt.verify(token, CUSTOMER_JWT_SECRET) as TJWTPayload;

    if (typeof decodedUser === "object") {
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

      const authJWT = jwt.sign(tokenData, CUSTOMER_JWT_SECRET, {
        expiresIn: ADMIN_ACCESS_TOKEN_EXPIRATION_TIME_SECOND
      });
      const authToken = "Bearer " + authJWT;

      const refreshJWT = jwt.sign(tokenData, CUSTOMER_JWT_SECRET, {
        expiresIn: CUSTOMER_REFRESH_TOKEN_EXPIRATION_TIME_SECOND
      });
      const refreshToken = "Bearer " + refreshJWT;

      const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: NODE_ENV !== "development"
      };

      const refreshCookieOptions: CookieOptions = {
        ...cookieOptions,
        maxAge: CUSTOMER_REFRESH_TOKEN_EXPIRATION_TIME_SECOND
      };

      req.user = user;

      res
        .cookie(COOKIE_KEYS.authAccessToken, authToken, cookieOptions)
        .cookie(
          COOKIE_KEYS.authRefreshToken,
          refreshToken,
          refreshCookieOptions
        )
        .cookie(COOKIE_KEYS.authCustomer, tokenData, cookieOptions);

      next();
    } else {
      return sendUnauthorized(res);
    }
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
      if (role === USER_ROLE.CUSTOMER) {
        let verified: string | JwtPayload | null = null;
        try {
          verified = jwt.verify(token, CUSTOMER_JWT_SECRET);
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
      } else {
        const verified = jwt.verify(token, ADMIN_JWT_SECRET);
        if (!verified) {
          sendUnauthorized(res);
          return;
        }

        const admin = await prisma.user.findUnique({
          where: {
            id: (tokenData as User).id,
            OR: [
              {
                role: USER_ROLE.SUPER_ADMIN
              },
              {
                role: USER_ROLE.OUTLET_ADMIN
              }
            ]
          }
        });
        if (!admin) {
          sendUnauthorized(res);
          return;
        }

        if (role !== admin.role) {
          sendUnauthorized(res);
          return;
        }

        req.user = admin;
      }
      next();
    } else {
      return sendUnauthorized(res);
    }
  } catch (err) {
    logger.error("auth processor error");
    logger.error(err);
    return sendUnauthorized(res);
  }
};

export const authenticator = (levels: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get authToken
      const cookies = req.cookies;
      const authToken =
        req.headers["authorization"] || cookies[COOKIE_KEYS.authAccessToken];

      if (!authToken) {
        sendUnauthorized(res);
        return;
      }

      // split token
      const token = authToken.split(" ")[1];
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
