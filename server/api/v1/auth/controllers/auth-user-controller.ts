import bcrypt from "bcrypt";
import { Request, Response } from "express";
import crypto from "node:crypto";
import { prisma } from "../../../../db";
import { serializeUserResponse } from "../../../../serializers/user";
import {
  removeFilesFromS3,
  uploadFileToS3
} from "../../../../services/amazonS3";
import { PROFILE_PHOTO_UPLOAD_FOLDER_NAME } from "../../../../settings/constants";
import {
  TUpdateUserInfoRequest,
  TUpdateUserPasswordRequest
} from "../../../../types/auth";

export const getAuthUser = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({
      message: "Unauthenticated"
    });
    return;
  }

  res.status(200).json(serializeUserResponse(req.user));
};

export const updateAuthUserInfo = async (
  req: Request<any, any, TUpdateUserInfoRequest, any>,
  res: Response
) => {
  if (!req.user) {
    res.status(401).json({
      message: "Unauthenticated"
    });
    return;
  }

  const { firstName, lastName } = req.body;

  const updatedUser = await prisma.user.update({
    where: {
      id: req.user.id
    },
    data: {
      firstName,
      lastName
    }
  });

  if (!updatedUser) {
    res.status(500).json({
      message: "Could not update the user info"
    });
    return;
  }

  res.status(200).json(serializeUserResponse(updatedUser));
};

export const updateAuthUserPassword = async (
  req: Request<any, any, TUpdateUserPasswordRequest, any>,
  res: Response
) => {
  if (!req.user || !req.user.password) {
    res.status(401).json({
      message: "Route is only valid for admin users"
    });
    return;
  }

  const { oldPassword, newPassword } = req.body;

  const isMatched = await bcrypt.compare(oldPassword, req.user.password);

  if (!isMatched) {
    res.status(400).json({
      oldPassword: "Old password did not match"
    });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const updatedUser = await prisma.user.update({
    where: {
      id: req.user.id
    },
    data: {
      password: hashedPassword
    }
  });

  if (!updatedUser) {
    res.status(500).json({
      message: "Could not update the user info"
    });
    return;
  }

  res.status(200).json(serializeUserResponse(updatedUser));
};

export const updateAuthUserPhoto = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "Profile photo is required" });
      return;
    }

    if (req.user.profilePhoto) {
      await removeFilesFromS3(req.user.profilePhoto);
    }

    const filename = `${PROFILE_PHOTO_UPLOAD_FOLDER_NAME}/${req.user.id}-${crypto.randomUUID()}.jpg`;

    await uploadFileToS3(req.file, { width: 300, height: 300 }, filename);

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { profilePhoto: filename }
    });

    res.status(200).json(serializeUserResponse(user));
  } catch (error) {
    res.status(500).json({
      message: (error as Error).message || "Failed to update profile photo"
    });
  }
};
