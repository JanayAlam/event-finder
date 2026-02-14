import { NextFunction, Request, Response } from "express";
import { assert } from "node:console";
import { z } from "zod";
import {
  PersonalInfoRequestSchema,
  TIdParam
} from "../../../../common/validation-schemas";
import FileUploadService from "../../../libs/external-services/file-upload.service";
import {
  getProfileTripStatus,
  getProfileWithUser,
  getSingleProfile,
  removeProfileImage,
  updatePersonalInfo,
  updateProfileImage
} from "../../../libs/use-cases/profile.use-case";
import ApiError from "../../../utils/api-error.util";
import { convertToObjectId } from "../../../utils/object-id.util";
import logger from "../../../utils/winston.util";

type TRequestBody = z.infer<typeof PersonalInfoRequestSchema>;

class ProfileController {
  static async getById(
    req: Request<TIdParam, any, any, any>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const profile = await getProfileWithUser({ _id: convertToObjectId(id)! });

      if (!profile) {
        throw new ApiError(404, "Profile not found");
      }

      res.json(profile);
    } catch (err) {
      next(err);
    }
  }

  static async update(
    req: Request<TIdParam, any, TRequestBody>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { firstName, lastName, dateOfBirth, gender, bio } = req.body;

      const existingProfile = await getSingleProfile({
        _id: convertToObjectId(id)!
      });

      if (!existingProfile) {
        throw new ApiError(404, "Profile not found");
      }

      if (!existingProfile.user.equals(req?.user?._id)) {
        throw new ApiError(403, "Cannot update other's personal info");
      }

      const profile = await updatePersonalInfo(convertToObjectId(id)!, {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        bio
      });

      res.status(200).json(profile);
    } catch (err) {
      next(err);
    }
  }

  static async uploadProfileImage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const userId = req.user?._id;
      assert(userId !== undefined, "'req.user._id' should not be undefined");

      const existingProfile = await getSingleProfile({
        _id: convertToObjectId(id)!
      });

      if (!existingProfile) {
        throw new ApiError(404, "Profile not found");
      }

      if (!existingProfile.user.equals(userId!)) {
        throw new ApiError(403, "Cannot update other's profile image");
      }

      const file = req.file;
      if (!file) {
        throw new ApiError(400, "No image file provided");
      }

      // Remove existing image if it exists
      if (existingProfile.profileImage) {
        try {
          await FileUploadService.remove(existingProfile.profileImage);
        } catch (error) {
          logger.error("Error removing existing profile image", error);
          // Continue with upload even if removal fails
        }
      }

      // Upload and crop the new image
      const uploadedFile = await FileUploadService.uploadAndCropToSquare(
        file,
        "profile-photo",
        512
      );

      // Update profile with new image path
      const profile = await updateProfileImage(
        convertToObjectId(id)!,
        uploadedFile.path
      );

      res.status(200).json(profile);
    } catch (err) {
      next(err);
    }
  }

  static async removeProfileImage(
    req: Request<TIdParam>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const userId = req.user?._id;
      assert(userId !== undefined, "'req.user._id' should not be undefined");

      const existingProfile = await getSingleProfile({
        _id: convertToObjectId(id)!
      });

      if (!existingProfile) {
        throw new ApiError(404, "Profile not found");
      }

      if (!existingProfile.user.equals(userId!)) {
        throw new ApiError(403, "Cannot remove other's profile image");
      }

      if (!existingProfile.profileImage) {
        throw new ApiError(400, "No profile image to remove");
      }

      // Remove the image file
      try {
        await FileUploadService.remove(existingProfile.profileImage);
      } catch (error) {
        logger.error("Error removing profile image file", error);
        // Continue with database update even if file removal fails
      }

      // Update profile to remove image path
      const profile = await removeProfileImage(convertToObjectId(id)!);

      res.status(200).json(profile);
    } catch (err) {
      next(err);
    }
  }

  static async getTripStatus(
    req: Request<TIdParam>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const profileStatus = await getProfileTripStatus(convertToObjectId(id)!);

      if (!profileStatus) {
        throw new ApiError(404, "Profile not found");
      }

      res.status(200).json(profileStatus);
    } catch (err) {
      next(err);
    }
  }
}

export default ProfileController;
