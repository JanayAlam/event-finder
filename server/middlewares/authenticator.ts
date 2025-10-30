import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { upsertUser } from "../services/user";
import { KINDE_SITE_URL } from "../settings/config";
import ApiError from "../utils/api-error";

const client = jwksClient({
  jwksUri: `${KINDE_SITE_URL}/.well-known/jwks.json`
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (_err, key) => {
    callback(null, key?.getPublicKey());
  });
}

export function authenticate(allowedRoles?: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new ApiError(401, "No token provided");
      }

      jwt.verify(
        token,
        getKey,
        { algorithms: ["RS256"] },
        async (err, decoded: any) => {
          if (err) {
            throw new ApiError(403, "Invalid token");
          }

          req.kindeUser = {
            sub: decoded.sub,
            email: decoded.email
          };

          const user = await upsertUser({
            kindeId: decoded.sub,
            email: decoded.email
          });

          req.user = user;

          if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
            throw new ApiError(403, `Access denied for role: ${user.role}`);
          }

          next();
        }
      );
    } catch (error) {
      next(error);
    }
  };
}
