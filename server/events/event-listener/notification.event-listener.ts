import { Types } from "mongoose";
import { EVENT_KEYS, USER_ROLE } from "../../enums";
import {
  createBulkNotifications,
  createNotification
} from "../../libs/use-cases/notification.use-case";
import { getAllUsers } from "../../libs/use-cases/user.use-case";
import logger from "../../utils/winston.util";
import { notificationEventEmitter } from "../event-emitters";

type TNotifyEventListenerParam = {
  userId: Types.ObjectId;
  message: string;
  link?: string;
};

// send notifications
notificationEventEmitter.on(
  EVENT_KEYS.NOTIFY,
  (data: TNotifyEventListenerParam) => {
    try {
      createNotification(data);
    } catch (err) {
      logger.error("Could not send notification", err);
    }
  }
);

type TNotifyAllEventListenerParam = Omit<TNotifyEventListenerParam, "userId">;

notificationEventEmitter.on(
  EVENT_KEYS.NOTIFY_ADMINS,
  async (param: TNotifyAllEventListenerParam) => {
    try {
      const allAdmins = await getAllUsers({
        filter: { role: USER_ROLE.ADMIN },
        projection: { _id: true }
      });

      const items: TNotifyEventListenerParam[] = allAdmins.map((user) => ({
        userId: user._id,
        message: param.message,
        link: param.link
      }));

      if (!items.length) {
        return;
      }

      createBulkNotifications(items);
    } catch (err) {
      logger.error("Could not send notifications", err);
    }
  }
);
