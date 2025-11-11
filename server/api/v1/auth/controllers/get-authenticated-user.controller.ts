import { NextFunction, Request, Response } from "express";
import ApiError from "../../../../utils/api-error";

export const getAuthenticatedUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new ApiError(404, "Authenticated user not found");
    }
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};
