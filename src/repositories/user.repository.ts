import { TVerificationStatusResponse } from "../../common/types";
import { TProfile } from "../../server/models/profile.model";
import { TUser } from "../../server/models/user.model";
import BaseRepository from "./base.repository";

export type TUserWithProfile = TUser & {
  profile: TProfile;
  accountVerification?: {
    status: TVerificationStatusResponse["status"];
  };
};

export type TGetAllUsersResponse = {
  users: TUserWithProfile[];
  total: number;
  page: number;
  limit: number;
};

class UserRepository extends BaseRepository {
  static apiRoute = "/users";

  constructor() {
    super();
  }

  static async getUserProfile(userId: string) {
    const url = `${this.apiRoute}/${userId}/profile`;
    const data = await this.request<undefined, TProfile>(url, "get");
    return data;
  }

  static async getAllUsers(params: {
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const data = await this.request<undefined, TGetAllUsersResponse>(
      this.apiRoute,
      "get",
      undefined,
      { params }
    );
    return data;
  }

  static async blockUser(userId: string) {
    const url = `${this.apiRoute}/${userId}/block`;
    const data = await this.request<undefined, { message: string }>(
      url,
      "patch"
    );
    return data;
  }

  static async unblockUser(userId: string) {
    const url = `${this.apiRoute}/${userId}/unblock`;
    const data = await this.request<undefined, { message: string }>(
      url,
      "patch"
    );
    return data;
  }
}

export default UserRepository;
