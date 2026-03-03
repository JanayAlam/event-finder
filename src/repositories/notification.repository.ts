import { TNotification } from "../../server/models/notification.model";
import BaseRepository from "./base.repository";

export type TNotificationResponse = {
  notifications: TNotification[];
  totalCount: number;
  unreadCount: number;
};

class NotificationRepository extends BaseRepository {
  static readonly apiRouter = "/notifications";

  static async getMyNotifications(
    page: number = 1,
    limit: number = 10
  ): Promise<TNotificationResponse> {
    const url = `${this.apiRouter}?page=${page}&limit=${limit}`;
    const response = await this.request<
      undefined,
      { data: TNotificationResponse }
    >(url, "get");
    return response.data;
  }

  static async markAsRead(id?: string): Promise<void> {
    const url = id
      ? `${this.apiRouter}/${id}/mark-as-read`
      : `${this.apiRouter}/mark-as-read`;
    await this.request<undefined, void>(url, "patch");
  }
}

export default NotificationRepository;
