import { Types } from "mongoose";
import Notification, { TNotification } from "../../models/notification.model";

type TCreateNotificationDto = {
  userId: Types.ObjectId;
  message: string;
  link?: string;
  isRead?: boolean;
};

export const createNotification = async (
  param: TCreateNotificationDto
): Promise<TNotification> => {
  const { userId, ...rest } = param;

  const createdNotification = await Notification.create({
    user: userId,
    ...rest
  });

  return {
    _id: createdNotification._id,
    user: createdNotification.user,
    message: createdNotification.message,
    link: createdNotification.link,
    isRead: createdNotification.isRead,
    updatedAt: createdNotification.updatedAt,
    createdAt: createdNotification.createdAt
  };
};

export const createBulkNotifications = async (
  param: TCreateNotificationDto[]
): Promise<void> => {
  await Notification.insertMany(
    param.map((user) => ({
      user: user.userId,
      message: user.message,
      link: user.link,
      isRead: user.isRead ?? false
    }))
  );
};
