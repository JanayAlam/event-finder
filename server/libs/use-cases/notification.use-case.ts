import { Types } from "mongoose";
import Notification, { TNotification } from "../../models/notification.model";
import { getIO } from "../../socket";

type TCreateNotificationDto = {
  userId: Types.ObjectId;
  message: string;
  type?: string;
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

  try {
    const io = getIO();
    io.to(`user-${userId.toString()}`).emit(
      "new-notification",
      createdNotification
    );
  } catch (_err) {
    // Socket not initialized, ignore
  }

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
  const items = param.map((user) => ({
    user: user.userId,
    message: user.message,
    type: user.type,
    link: user.link,
    isRead: user.isRead ?? false
  }));

  const createdNotifications = await Notification.insertMany(items);

  try {
    const io = getIO();
    createdNotifications.forEach((notif) => {
      io.to(`user-${notif.user.toString()}`).emit("new-notification", notif);
    });
  } catch (_err) {
    // Socket not initialized, ignore
  }
};
export const getNotifications = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  notifications: TNotification[];
  totalCount: number;
  unreadCount: number;
}> => {
  const skip = (page - 1) * limit;

  const [notifications, totalCount, unreadCount] = await Promise.all([
    Notification.find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments({ user: new Types.ObjectId(userId) }),
    Notification.countDocuments({
      user: new Types.ObjectId(userId),
      isRead: false
    })
  ]);

  return {
    notifications: notifications as unknown as TNotification[],
    totalCount,
    unreadCount
  };
};

export const markAsRead = async (
  userId: string,
  notificationId?: string
): Promise<void> => {
  if (notificationId) {
    await Notification.updateOne(
      {
        _id: new Types.ObjectId(notificationId),
        user: new Types.ObjectId(userId)
      },
      { isRead: true }
    );
  } else {
    await Notification.updateMany(
      { user: new Types.ObjectId(userId), isRead: false },
      { isRead: true }
    );
  }
};
