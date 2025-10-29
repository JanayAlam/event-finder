import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { serializeUserResponse } from "../../../../serializers/user";
import {
  TUpdateUserInfoRequest,
  TUpdateUserPasswordRequest
} from "../../../../types/auth";
import ApiError from "../../../../utils/api-error";

export const getAuthUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // if (!req.user) {
    //   throw new ApiError(401, "Unauthenticated");
    // }

    res.status(200).json(serializeUserResponse({}));
  } catch (err) {
    next(err);
  }
};

export const updateAuthUserInfo = async (
  req: Request<any, any, TUpdateUserInfoRequest, any>,
  res: Response,
  next: NextFunction
) => {
  try {
    // if (!req.user) {
    //   throw new ApiError(401, "Unauthenticated");
    // }

    const { firstName, lastName } = req.body;

    res.status(200).json(serializeUserResponse({}));
  } catch (err) {
    next(err);
  }
};

export const updateAuthUserPassword = async (
  req: Request<any, any, TUpdateUserPasswordRequest, any>,
  res: Response,
  next: NextFunction
) => {
  try {
    // if (!req.user || !req.user.password) {
    //   throw new ApiError(403, "Route is only valid for admin users");
    // }

    const { oldPassword, newPassword } = req.body;

    const isMatched = await bcrypt.compare(oldPassword, "req.user.password");

    if (!isMatched) {
      throw new ApiError(400, undefined, {
        oldPassword: "Old password did not match"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // const updatedUser = await prisma.user.update({
    //   where: {
    //     id: req.user.id
    //   },
    //   data: {
    //     password: hashedPassword
    //   }
    // });

    // if (!updatedUser) {
    //   throw new Error("Could not update the user info");
    // }

    res.status(200).json(serializeUserResponse({}));
  } catch (err) {
    next(err);
  }
};

export const updateAuthUserPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const profilePhoto = req.file;

    // if (!req.user?.id) {
    //   throw new ApiError(401, "Unauthenticated");
    // }

    if (!profilePhoto) {
      throw new ApiError(400, undefined, {
        profilePhoto: "Profile photo is required"
      });
    }

    // const user = await prisma.user.update({
    //   where: { id: req.user.id },
    //   data: { profilePhoto: filename }
    // });

    res.status(200).json(serializeUserResponse({}));
  } catch (err) {
    next(err);
  }
};
