import { Document, model, Schema, Types } from "mongoose";
import { ITimestamps, ModelWithObjectId } from "../types/common";
import User from "./user.model";

interface NotificationBase extends ITimestamps {
  user: Types.ObjectId;
  message: string;
  type?: string;
  link?: string;
  isRead: boolean;
}

export interface INotificationDoc extends NotificationBase, Document {
  _id: Types.ObjectId;
}

const notificationSchema = new Schema<INotificationDoc>(
  {
    user: {
      type: Schema.ObjectId,
      ref: User,
      required: true,
      index: true
    },
    message: { type: String, required: true },
    type: { type: String },
    link: { type: String },
    isRead: { type: Boolean, default: false, required: true }
  },
  { timestamps: true }
);

const Notification = model<INotificationDoc>(
  "notifications",
  notificationSchema
);

export type TNotification = ModelWithObjectId<NotificationBase>;

export default Notification;
