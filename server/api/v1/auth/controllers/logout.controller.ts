import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { KINDE_DOMAIN } from "../../../../settings/config";
import { COOKIE_KEYS, cookieOptions } from "../../../../settings/cookies";

export const logoutController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await axios.get(`${KINDE_DOMAIN}/logout`, { withCredentials: true });
    Object.values(COOKIE_KEYS).forEach((key) =>
      res.clearCookie(key, cookieOptions)
    );
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};
