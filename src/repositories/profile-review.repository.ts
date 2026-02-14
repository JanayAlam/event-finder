import {
  TProfileReviewRequest,
  TUpdateProfileReviewRequest
} from "../../common/validation-schemas";
import { TProfileReview } from "../../server/models/profile-review.model";
import BaseRepository from "./base.repository";

class ProfileReviewRepository extends BaseRepository {
  static apiRoute = "/profile-reviews";

  constructor() {
    super();
  }

  static async createReview(reviewData: TProfileReviewRequest) {
    const data = await this.request<TProfileReviewRequest, TProfileReview>(
      this.apiRoute,
      "post",
      reviewData
    );
    return data;
  }

  static async updateReview(
    id: string,
    reviewData: TUpdateProfileReviewRequest
  ) {
    const url = `${this.apiRoute}/${id}`;
    const data = await this.request<
      TUpdateProfileReviewRequest,
      TProfileReview
    >(url, "patch", reviewData);
    return data;
  }

  static async getReviewsOfProfile(profileId: string) {
    const url = `${this.apiRoute}/profiles/${profileId}`;
    const data = await this.request<undefined, TProfileReview[]>(url, "get");
    return data;
  }
}

export default ProfileReviewRepository;
