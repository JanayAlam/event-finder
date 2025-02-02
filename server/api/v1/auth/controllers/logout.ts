import { NextFunction, Request, Response } from "express";
import { COOKIE_KEYS } from "../../../../settings/cookies";

export const logoutHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie(COOKIE_KEYS.authAccessToken);
    res.clearCookie(COOKIE_KEYS.authRefreshToken);
    res.clearCookie(COOKIE_KEYS.authUser);

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
