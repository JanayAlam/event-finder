import { TProfile } from "../../server/models/profile.model";
import BaseRepository from "./base.repository";

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
}

export default UserRepository;
