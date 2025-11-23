import { NextFunction, Request, Response } from "express";
import { getProfileByUserId } from "../../../../services/profile";
import ApiError from "../../../../utils/api-error";
import { convertToObjectId } from "../../../../utils/object-id";

export const getUserProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const profile = await getProfileByUserId(convertToObjectId(id));

    if (!profile) {
      throw new ApiError(404, "Profile not found");
    }

    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};
