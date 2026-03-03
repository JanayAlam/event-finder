import EventEmitter from "events";
import { EVENT_KEYS } from "../../enums";

class NotificationEventEmitter extends EventEmitter {
  private static instance: NotificationEventEmitter;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!NotificationEventEmitter.instance) {
      NotificationEventEmitter.instance = new NotificationEventEmitter();
    }
    return NotificationEventEmitter.instance;
  }

  sendNotification(userId: string, message: string, link?: string) {
    this.emit(EVENT_KEYS.NOTIFY, { userId, message, link });
  }

  notifyAdmins(message: string, link?: string) {
    this.emit(EVENT_KEYS.NOTIFY_ADMINS, { message, link });
  }

  emitHostRequest(data: { userId: string; name: string }) {
    this.emit(EVENT_KEYS.HOST_REQUEST, data);
  }

  emitAccountVerificationReview(data: {
    userId: string;
    name: string;
    verificationId: string;
  }) {
    this.emit(EVENT_KEYS.ACCOUNT_VERIFICATION_REVIEW, data);
  }

  emitEventCreated(data: { eventId: string; title: string; hostName: string }) {
    this.emit(EVENT_KEYS.EVENT_CREATED, data);
  }

  emitMemberJoined(data: {
    eventId: string;
    eventTitle: string;
    hostId: string;
    memberName: string;
  }) {
    this.emit(EVENT_KEYS.MEMBER_JOINED, data);
  }

  emitAccountVerificationResult(data: {
    userId: string;
    status: string;
    message?: string;
  }) {
    this.emit(EVENT_KEYS.ACCOUNT_VERIFICATION_RESULT, data);
  }

  emitHostRequestResult(data: { userId: string; isApproved: boolean }) {
    this.emit(EVENT_KEYS.HOST_REQUEST_RESULT, data);
  }

  emitFacebookPosted(data: {
    eventId: string;
    eventTitle: string;
    postUrl: string;
  }) {
    this.emit(EVENT_KEYS.FACEBOOK_POSTED, data);
  }

  emitPostCreated(data: {
    eventId: string;
    eventTitle: string;
    hostId: string;
    creatorName: string;
  }) {
    this.emit(EVENT_KEYS.POST_CREATED, data);
  }

  emitPostCommented(data: {
    discussionId: string;
    eventId: string;
    eventTitle: string;
    postCreatorId: string;
    commenterName: string;
    commenterIds: string[];
  }) {
    this.emit(EVENT_KEYS.POST_COMMENTED, data);
  }
}

export default NotificationEventEmitter.getInstance();
