import { NextFunction, Request, Response } from "express";
import { COOKIE_KEYS } from "../../../../settings/cookies";
import ApiError from "../../../../utils/api-error";

export const getMeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authAccessToken, authRefreshToken, authUser } = COOKIE_KEYS;

  try {
    const accessToken = req.cookies?.[authAccessToken] as string | undefined;
    const refreshToken = req.cookies?.[authRefreshToken] as string | undefined;
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
};
