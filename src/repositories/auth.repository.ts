import { TProfile } from "../../server/models/profile.model";
import BaseRepository from "./base.repository";

class AuthRepository extends BaseRepository {
  static readonly apiRouter = "/auth";

  constructor() {
    super();
  }

  static logout() {
    const url = `${AuthRepository.apiRouter}/logout`;
    return this.request<undefined, { message: string }>(url, "get");
  }

  static getMyProfile() {
    const url = `${AuthRepository.apiRouter}/my-profile`;
    return this.request<undefined, TProfile>(url, "get");
  }
}

export default AuthRepository;
