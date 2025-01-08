import { USER_ROLE } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../../../db";
import {
  TBlockUserRequest,
  TUnblockUserRequest
} from "../../../../types/admin";

export const blockUserHandler = async (
  req: Request<any, any, TBlockUserRequest, any>,
  res: Response
) => {
  const { userId } = req.body;

  try {
    await prisma.user.update({
      where: {
        id: userId,
        role: { not: USER_ROLE.SUPER_ADMIN },
        isUserBlocked: false
      },
      data: {
        isUserBlocked: true
      }
    });
    res.status(204).send();
  } catch (err) {
    res.status(404).json({
      message: "User not found or cannot be blocked"
    });
  }
};

export const unblockUserHandler = async (
  req: Request<any, any, TUnblockUserRequest, any>,
  res: Response
) => {
  const { userId } = req.body;

  try {
    await prisma.user.update({
      where: {
        id: userId,
        role: { not: USER_ROLE.SUPER_ADMIN },
        isUserBlocked: true
      },
      data: {
        isUserBlocked: false
      }
    });
    res.status(204).send();
  } catch (err) {
    res.status(404).json({
      message: "User not found or cannot be unblocked"
    });
  }
};
