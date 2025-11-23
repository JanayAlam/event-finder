import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import {
  PersonalInfoRequestSchema,
  TIdParam
} from "../../../../../validation-schemas";
import { updatePersonalInfo } from "../../../../services/profile";
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

    const profile = await updatePersonalInfo(id, {
      firstName,
      lastName,
      dateOfBirth
    });

    if (!profile) {
      throw new ApiError(404, "Profile not found");
    }

    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};
