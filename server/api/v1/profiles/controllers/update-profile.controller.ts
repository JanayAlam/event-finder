import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import {
  PersonalInfoRequestSchema,
  TIdParam
} from "../../../../../validation-schemas";
import {
  getSingleProfile,
  updatePersonalInfo
} from "../../../../services/profile";
import ApiError from "../../../../utils/api-error";

type TRequestBody = z.infer<typeof PersonalInfoRequestSchema>;

export const updatePersonalInfoController = async (
  req: Request<TIdParam, any, TRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, dateOfBirth } = req.body;

    const existingProfile = await getSingleProfile({ _id: id });

    if (!existingProfile) {
      throw new ApiError(404, "Profile not found");
    }

    if (!existingProfile.user.equals(req.user?._id)) {
      throw new ApiError(403, "Cannot update other's personal info");
    }

    const profile = await updatePersonalInfo(id, {
      firstName,
      lastName,
      dateOfBirth
    });

    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};
