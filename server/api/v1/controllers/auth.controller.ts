import axios from "axios";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "node:crypto";
import { z } from "zod";
import { RefreshAccessTokenDtoSchema } from "../../../../common/validation-schemas";
import { createUserAndProfile } from "../../../libs/aggregations";
import {
  getAuthorizationTokens,
  getAuthorizationUrl,
  refreshAccessToken
} from "../../../libs/external-services/kinde.service";
import { getProfileByUserId } from "../../../libs/use-cases/profile.use-case";
import { getUser } from "../../../libs/use-cases/user.use-case";
import { TUser } from "../../../models/user.model";
import {
  ACCESS_TOKEN_EXPIRY,
  KINDE_DOMAIN,
  PUBLIC_SERVER_URL,
  REFRESH_TOKEN_EXPIRY
} from "../../../settings/config";
import { COOKIE_KEYS, cookieOptions } from "../../../settings/cookies";
import ApiError from "../../../utils/api-error.util";

type TRefreshAccessTokenRequestBodyDto = z.infer<
  typeof RefreshAccessTokenDtoSchema
>;

class AuthController {
  private static setAuthCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
    user: TUser
  ) {
    res.cookie(COOKIE_KEYS.authAccessToken, tokens.accessToken, {
      ...cookieOptions,
      maxAge: ACCESS_TOKEN_EXPIRY * 1000
    });
    res.cookie(COOKIE_KEYS.authRefreshToken, tokens.refreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_TOKEN_EXPIRY * 1000
    });
    res.cookie(COOKIE_KEYS.authUser, JSON.stringify(user), cookieOptions);
  }

  static async login(_req: Request, res: Response) {
    const state = crypto.randomBytes(16).toString("hex");
    res.cookie(COOKIE_KEYS.oauthState, state, cookieOptions);

    const authorizeUrl = getAuthorizationUrl(state);
    res.redirect(authorizeUrl);
  }

  static async loginCallback(req: Request, res: Response, next: NextFunction) {
    const code = req.query.code as string;
    const returnedState = req.query.state as string | undefined;
    const storedState = req.cookies?.[COOKIE_KEYS.oauthState] as
      | string
      | undefined;

    if (!code) {
      res.status(400).send("Missing code");
      return;
    }

    if (!returnedState || !storedState || returnedState !== storedState) {
      res.status(400).send("Invalid state");
      return;
    }

    try {
      const tokens = await getAuthorizationTokens(code);

      const decoded = jwt.decode(tokens.idToken) as JwtPayload;

      const {
        sub,
        email,
        given_name: firstName,
        family_name: lastName
      } = decoded;

      if (!sub || !email) {
        throw new ApiError(500, "Invalid JWT payload");
      }

      let user = await getUser({ kindeId: sub, email });

      if (!user) {
        const { user: createdUser } = await createUserAndProfile({
          kindeId: sub,
          email,
          firstName,
          lastName
        });

        user = createdUser;
      }

      this.setAuthCookies(res, tokens, user);

      res.cookie(COOKIE_KEYS.oauthState, "", {
        ...cookieOptions,
        maxAge: 0,
        path: "/"
      });

      res.redirect(`${PUBLIC_SERVER_URL}/`);
    } catch (err) {
      next(err);
    }
  }

  static async refreshAccessToken(
    req: Request<unknown, unknown, TRefreshAccessTokenRequestBodyDto>,
    res: Response
  ) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ApiError(401, "Refresh token not found");
    }

    const tokens = await refreshAccessToken(refreshToken);

    const decoded = jwt.decode(tokens.idToken) as JwtPayload;

    const { sub, email } = decoded;

    if (!sub || !email) {
      throw new ApiError(500, "Invalid JWT payload");
    }

    const user = await getUser({
      kindeId: sub,
      email
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    this.setAuthCookies(res, tokens, user);

    res.status(200).json({
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  }

  static async logout(_req: Request, res: Response, next: NextFunction) {
    try {
      await axios.get(`${KINDE_DOMAIN}/logout`, { withCredentials: true });
      Object.values(COOKIE_KEYS).forEach((key) =>
        res.clearCookie(key, cookieOptions)
      );
      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    const { authAccessToken, authRefreshToken, authUser } = COOKIE_KEYS;

    try {
      const accessToken = req.cookies?.[authAccessToken] as string | undefined;
      const refreshToken = req.cookies?.[authRefreshToken] as
        | string
        | undefined;
      const userCookie = req.cookies?.[authUser] as string | undefined;

      if (!accessToken || !refreshToken || !userCookie) {
        throw new ApiError(401, "Authentication required");
      }

      let user;
      try {
        user = JSON.parse(userCookie);
      } catch {
        throw new ApiError(400, "Invalid user data in cookies");
      }

      res.json({
        accessToken,
        refreshToken,
        user
      });
    } catch (err) {
      next(err);
    }
  }

  static async selfProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await getProfileByUserId(req.user?._id);

      if (!profile) {
        throw new ApiError(404, "Profile not found");
      }

      res.json(profile);
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
