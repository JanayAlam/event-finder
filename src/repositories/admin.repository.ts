import {
  TAdminEventListResponseDto,
  TAdminEventListItemDto,
  TAdminPaymentListResponseDto,
  TAdminPaymentStatsDto
} from "../../common/types";
import BaseRepository from "./base.repository";

export type TDashboardStatistics = {
  totalUsers: number;
  newUsersThisMonth: number;
  totalHosts: number;
  totalEvents: number;
  eventsThisMonth: number;
  totalDiscussions: number;
  pendingVerifications: number;
  pendingPromotions: number;
  growth: {
    users: { _id: { month: number; year: number }; count: number }[];
    events: { _id: { month: number; year: number }; count: number }[];
  };
  popularLocations: { _id: string; count: number }[];
  topHosts: { id: string; email: string; eventCount: number }[];
};

class AdminRepository extends BaseRepository {
  static apiRoute = "/admins";

  static async getStatistics() {
    const url = `${this.apiRoute}/statistics`;
    const data = await this.request<undefined, TDashboardStatistics>(
      url,
      "get"
    );
    return data;
  }

  static async getEvents(params: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const query = new URLSearchParams({
      page: String(params.page || 1),
      limit: String(params.limit || 10)
    });

    if (params.search?.trim()) {
      query.set("search", params.search.trim());
    }

    const url = `${this.apiRoute}/events?${query.toString()}`;
    return this.request<undefined, TAdminEventListResponseDto>(url, "get");
  }

  static async blockEvent(eventId: string) {
    const url = `${this.apiRoute}/events/${eventId}/block`;
    return this.request<undefined, { message: string; status: string }>(
      url,
      "patch"
    );
  }

  static async getPaymentStats() {
    const url = `${this.apiRoute}/payments/stats`;
    return this.request<undefined, TAdminPaymentStatsDto>(url, "get");
  }

  static async getPayments(params: { page?: number; limit?: number }) {
    const query = new URLSearchParams({
      page: String(params.page || 1),
      limit: String(params.limit || 10)
    });

    const url = `${this.apiRoute}/payments?${query.toString()}`;
    return this.request<undefined, TAdminPaymentListResponseDto>(url, "get");
  }
}

export default AdminRepository;
export type { TAdminEventListItemDto };
