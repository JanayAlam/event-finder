import { TAllPendingHostVerificationResponse } from "../../common/types";
import { TPromotionRequest } from "../../server/models/promotion-request.model";
import BaseRepository from "./base.repository";

class PromotionRequestRepository extends BaseRepository {
  static apiRoute = "/promotion-requests";

  constructor() {
    super();
  }

  static async create(userId: string) {
    const url = this.apiRoute;
    const data = await this.request<{ userId: string }, TPromotionRequest>(
      url,
      "post",
      { userId }
    );
    return data;
  }

  static async getAllPendingRequests() {
    const url = this.apiRoute;
    const data = await this.request<
      undefined,
      TAllPendingHostVerificationResponse
    >(url, "get");
    return data;
  }

  static async acceptRequest(id: string) {
    const url = `${this.apiRoute}/${id}/accept`;
    const data = await this.request<undefined, TPromotionRequest>(url, "patch");
    return data;
  }

  static async rejectRequest(id: string) {
    const url = `${this.apiRoute}/${id}/reject`;
    const data = await this.request<undefined, TPromotionRequest>(url, "patch");
    return data;
  }
}

export default PromotionRequestRepository;
