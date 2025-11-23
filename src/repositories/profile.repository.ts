import { TProfile } from "../../server/models/profile.model";
import { TPersonalInfoRequestDto } from "../../validation-schemas";
import BaseRepository from "./base.repository";

class ProfileRepository extends BaseRepository {
  static apiRoute = "/profiles";

  constructor() {
    super();
  }

  static async updatePersonalInfo(
    id: string,
    requestBody: TPersonalInfoRequestDto
  ) {
    const url = `${this.apiRoute}/${id}/personal-info`;
    const data = await this.request<TPersonalInfoRequestDto, TProfile>(
      url,
      "patch",
      requestBody
    );
    return data;
  }
}

export default ProfileRepository;
