import axios from "axios";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { getUser } from "../services/user";
import {
  KINDE_CLIENT_ID,
  KINDE_CLIENT_SECRET,
  KINDE_SITE_URL
} from "../settings/config";
import { COOKIE_KEYS, cookieOptions } from "../settings/cookies";
import ApiError from "../utils/api-error";

function getKey(header: any, callback: any) {
  const client = jwksClient({
    jwksUri: `${KINDE_SITE_URL}/.well-known/jwks.json`
  });
  client.getSigningKey(header.kid, (_err, key) => {
    callback(null, key?.getPublicKey());
  });
}

async function refreshKindeToken(refreshToken: string) {
  try {
    const { data } = await axios.post(
      `${KINDE_SITE_URL}/oauth2/token`,
      new URLSearchParams({
        grant_type: "refresh_token",
        client_id: KINDE_CLIENT_ID!,
        client_secret: KINDE_CLIENT_SECRET!,
        refresh_token: refreshToken
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      }
    );
    return {
      idToken: data.id_token,
      accessToken: data.access_token,
      refreshToken: data.refresh_token
    };
  } catch {
    throw new ApiError(401, "Failed to refresh token");
  }
}

export function authenticate(allowedRoles?: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken =
        req.cookies?.[COOKIE_KEYS.authAccessToken] ||
        req.headers.authorization?.split(" ")[1];
      if (!accessToken) {
        throw new ApiError(401, "Access token not found");
      }

      let decoded: JwtPayload | null = null;
      try {
        const verified = await new Promise<JwtPayload | string>(
          (resolve, reject) => {
            jwt.verify(
              accessToken as string,
              getKey as any,
              { algorithms: ["RS256"] },
              (err, payload) => {
                if (err) return reject(err);
                resolve(payload as JwtPayload | string);
              }
            );
          }
        );

        decoded =
          typeof verified === "string"
            ? (jwt.decode(verified) as JwtPayload)
            : (verified as JwtPayload);
      } catch (err) {
        const refreshToken = req.cookies?.[COOKIE_KEYS.authRefreshToken];

        if (!refreshToken) {
          throw new ApiError(401, "Token expired and no refresh token");
        }

        const newTokens = await refreshKindeToken(refreshToken as string);

        decoded = jwt.decode(
          newTokens.idToken || newTokens.accessToken
        ) as JwtPayload;

        res.cookie(
          COOKIE_KEYS.authAccessToken,
          newTokens.accessToken,
          cookieOptions
        );

        res.cookie(
          COOKIE_KEYS.authRefreshToken,
          newTokens.refreshToken,
          cookieOptions
        );
      }

      if (!decoded) {
        throw new ApiError(403, "Invalid token");
      }

      const kindeId = decoded.sub;
      const emailAddr = decoded.email;

      if (typeof kindeId !== "string" || typeof emailAddr !== "string") {
        throw new ApiError(403, "Invalid token payload");
      }

      const user = await getUser({ kindeId, email: emailAddr });

      if (!user) {
        throw new ApiError(403, "Authorized user not found");
      }

      req.user = user;
      req.kindeUser = { sub: kindeId, email: emailAddr };

      if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
        throw new ApiError(403, `Access denied for role: ${user.role}`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
