import { Types } from "mongoose";
import { EVENT_KEYS, USER_ROLE } from "../../enums";
import {
  createBulkNotifications,
  createNotification
} from "../../libs/use-cases/notification.use-case";
import UserUseCase from "../../libs/use-cases/user.use-case";
import logger from "../../utils/winston.util";
import notificationEventEmitter from "../emitters/notification.event-emitter";

// Basic notification
notificationEventEmitter.on(EVENT_KEYS.NOTIFY, (data: any) => {
  try {
    createNotification({ ...data, type: EVENT_KEYS.NOTIFY });
  } catch (err) {
    logger.error("Could not send notification", err);
  }
});

// Notify all admins
notificationEventEmitter.on(EVENT_KEYS.NOTIFY_ADMINS, async (param: any) => {
  try {
    const allAdmins = await UserUseCase.getAllUsers({
      filter: { role: USER_ROLE.ADMIN },
      projection: { _id: true }
    });

    const items = allAdmins.map((user) => ({
      userId: user._id,
      message: param.message,
      type: EVENT_KEYS.NOTIFY_ADMINS,
      link: param.link
    }));

    if (items.length) {
      createBulkNotifications(items);
    }
  } catch (err) {
    logger.error("Could not send notifications to admins", err);
  }
});

// Host Request (to all admins)
notificationEventEmitter.on(EVENT_KEYS.HOST_REQUEST, (data: any) => {
  notificationEventEmitter.notifyAdmins(
    `${data.name} has requested to become a host.`,
    `/admin/host-requests`
  );
});

// Account Verification Review (to all admins)
notificationEventEmitter.on(
  EVENT_KEYS.ACCOUNT_VERIFICATION_REVIEW,
  (data: any) => {
    notificationEventEmitter.notifyAdmins(
      `${data.name} has submitted account verification documents.`,
      `/admin/verifications`
    );
  }
);

// Event Created (to all admins)
notificationEventEmitter.on(EVENT_KEYS.EVENT_CREATED, (data: any) => {
  notificationEventEmitter.notifyAdmins(
    `New event created: "${data.title}" by ${data.hostName}.`,
    `/events/view/${data.eventId}`
  );
});

// Member Joined (to the host)
notificationEventEmitter.on(EVENT_KEYS.MEMBER_JOINED, (data: any) => {
  createNotification({
    userId: new Types.ObjectId(data.hostId),
    message: `${data.memberName} joined your event "${data.eventTitle}".`,
    type: EVENT_KEYS.MEMBER_JOINED,
    link: `/events/view/${data.eventId}`
  });
});

// Account Verification Result (to the user)
notificationEventEmitter.on(
  EVENT_KEYS.ACCOUNT_VERIFICATION_RESULT,
  (data: any) => {
    createNotification({
      userId: new Types.ObjectId(data.userId),
      message: `Your account verification request has been ${data.status.toLowerCase()}. ${data.message || ""}`,
      type: EVENT_KEYS.ACCOUNT_VERIFICATION_RESULT,
      link: `/profile`
    });
  }
);

// Host Request Result (to the user)
notificationEventEmitter.on(EVENT_KEYS.HOST_REQUEST_RESULT, (data: any) => {
  createNotification({
    userId: new Types.ObjectId(data.userId),
    message: `Your host request has been ${data.isApproved ? "accepted" : "rejected"}.`,
    type: EVENT_KEYS.HOST_REQUEST_RESULT,
    link: `/profile`
  });
});

// Facebook Posted (to all admin)
notificationEventEmitter.on(EVENT_KEYS.FACEBOOK_POSTED, (data: any) => {
  notificationEventEmitter.notifyAdmins(
    `Event "${data.eventTitle}" has been posted to Facebook.`,
    `/events/view/${data.eventId}`
  );
});

// Post Created (to the host)
notificationEventEmitter.on(EVENT_KEYS.POST_CREATED, (data: any) => {
  createNotification({
    userId: new Types.ObjectId(data.hostId),
    message: `${data.creatorName} started a discussion in your event "${data.eventTitle}".`,
    type: EVENT_KEYS.POST_CREATED,
    link: `/events/view/${data.eventId}`
  });
});

// Post Comments (to post creator & all commenters)
notificationEventEmitter.on(EVENT_KEYS.POST_COMMENTED, (data: any) => {
  const recipients = new Set<string>();
  recipients.add(data.postCreatorId);
  data.commentersIds.forEach((id: string) => recipients.add(id));

  // Remove the person who just commented (if we had their ID, but for now let's assume emitter handles that or we just notify everyone else)
  // The data should ideally exclude the current commenter's ID from commentersIds.

  const items = Array.from(recipients).map((userId) => ({
    userId: new Types.ObjectId(userId),
    message: `${data.commenterName} commented on a post in "${data.eventTitle}".`,
    type: EVENT_KEYS.POST_COMMENTED,
    link: `/events/view/${data.eventId}`
  }));

  if (items.length) {
    createBulkNotifications(items);
  }
});
