import { Request, Response } from "express";
import * as NotificationUseCase from "../../../libs/use-cases/notification.use-case";

export const getMyNotifications = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await NotificationUseCase.getNotifications(
    userId.toString(),
    page,
    limit
  );

  res.status(200).json({
    message: "Notifications retrieved successfully",
    data: result
  });
};

export const markAsRead = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { id } = req.params;

  await NotificationUseCase.markAsRead(userId.toString(), id);

  res.status(200).json({
    message: "Notifications marked as read"
  });
};
