import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TUserRole } from "../enums";
import { getKindePublicKey } from "../services/kinde";
import { getUser } from "../services/user";
import ApiError from "../utils/api-error";
import logger from "../utils/winston";

export function authenticate(allowedRoles?: TUserRole[]) {
  return async (
    req: Request<any, any, any, any>,
    _res: Response,
    next: NextFunction
  ) => {
    const authorizationHeader = req.headers.authorization;

    try {
      if (!authorizationHeader) {
        throw new ApiError(401, "Authorization header not not found");
      }

      const isBearerToken = authorizationHeader.startsWith("Bearer ");

      if (!isBearerToken) {
        throw new ApiError(401, "Token must be a bearer token");
      }
    } catch (err) {
      next(err);
      return;
    }

    const bearerToken = authorizationHeader.replace("Bearer ", "");

    let decodedPayload: JwtPayload | null = null;

    try {
      const payload = await new Promise<JwtPayload | string>(
        (resolve, reject) => {
          jwt.verify(
            bearerToken,
            getKindePublicKey,
            { algorithms: ["RS256"] },
            (err, payload) => {
              if (err) return reject(err);
              resolve(payload as JwtPayload | string);
            }
          );
        }
      );

      decodedPayload =
        typeof payload === "string"
          ? (jwt.decode(payload) as JwtPayload)
          : (payload as JwtPayload);
    } catch (err) {
      logger.error("JWT verification failed", {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined
      });
      next(new ApiError(401, "Access token is not verified"));
      return;
    }

    try {
      if (!decodedPayload) {
        throw new ApiError(403, "Invalid token");
      }

      const kindeId = decodedPayload.sub;
      const emailAddr = decodedPayload.email;

      if (typeof kindeId !== "string" || typeof emailAddr !== "string") {
        throw new ApiError(403, "Invalid token payload");
      }

      const user = await getUser({ kindeId, email: emailAddr });

      if (!user) {
        throw new ApiError(403, "Authorized user not found");
      }

      if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
        throw new ApiError(403, `Access denied for role: ${user.role}`);
      }

      req.user = user;
      req.kindeUser = { sub: kindeId, email: emailAddr };

      next();
    } catch (err) {
      next(err);
    }
  };
}
