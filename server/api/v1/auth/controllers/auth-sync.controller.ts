import { NextFunction, Request, Response } from "express";
import { upsertUser } from "../../../../services/user";
import ApiError from "../../../../utils/api-error";

export const authSyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user) {
    res.json(req.user);
    return;
  }

  try {
    if (!req.kindeUser) {
      throw new ApiError(401, "Unauthorized");
    }

    const user = await upsertUser({
      kindeId: req.kindeUser.sub,
      email: req.kindeUser.email
    });

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
