import { NextFunction, Request, Response } from "express";
import { ApiError } from "next/dist/server/api-utils";
import { z } from "zod";
import {
  PersonalInfoRequestSchema,
  TIdParam
} from "../../../../common/validation-schemas";
import {
  getSingleProfile,
  updatePersonalInfo
} from "../../../libs/use-cases/profile.use-case";

type TRequestBody = z.infer<typeof PersonalInfoRequestSchema>;

class ProfileController {
  static async update(
    req: Request<TIdParam, any, TRequestBody>,
    res: Response,
    next: NextFunction
  ) {
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
  }
}

export default ProfileController;
