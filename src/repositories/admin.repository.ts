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
}

export default AdminRepository;
