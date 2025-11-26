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
}

export default NotificationEventEmitter.getInstance();
