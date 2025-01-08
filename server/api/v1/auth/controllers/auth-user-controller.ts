import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../../../../db";
import {
  TUpdateUserInfoRequest,
  TUpdateUserPasswordRequest
} from "../../../../types/auth";
import { getUserWithoutPassword } from "../utils";

export const getAuthUser = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({
      message: "Unauthenticated"
    });
    return;
  }

  res.status(200).json(getUserWithoutPassword(req.user));
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

  res.status(200).json(getUserWithoutPassword(updatedUser));
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

  res.status(200).json(getUserWithoutPassword(updatedUser));
};

export const updateAuthUserPhoto = (req: Request, res: Response) => {};
