import { TPersonalInfoRequestDto } from "../../common/validation-schemas";
import { TProfile, TProfileWithUser } from "../../server/models/profile.model";
import { isAxiosError } from "axios";
import BaseRepository from "./base.repository";

class ProfileRepository extends BaseRepository {
  static apiRoute = "/profiles";

  constructor() {
    super();
  }

  static async getProfileWithUser(id: string) {
    try {
      const url = `${this.apiRoute}/${id}`;
      const data = await this.request<undefined, TProfileWithUser>(url, "get");
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return null;
      }

      throw error;
    }
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

  static async uploadProfileImage(id: string, imageFile: File) {
    const url = `${this.apiRoute}/${id}/profile-image`;
    const formData = BaseRepository.convertToFormData({
      profileImage: imageFile
    });
    const data = await this.request<FormData, TProfile>(url, "post", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return data;
  }

  static async removeProfileImage(id: string) {
    const url = `${this.apiRoute}/${id}/profile-image`;
    const data = await this.request<undefined, TProfile>(url, "delete");
    return data;
  }

  static async getTripStatus(id: string) {
    try {
      const url = `${this.apiRoute}/${id}/trips-status`;
      const data = await this.request<
        undefined,
        {
          eventsJoined: number;
          eventsHosted: number | null;
          rating: number | "N/A";
          memberSince: string;
        }
      >(url, "get");
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return null;
      }

      throw error;
    }
  }
}

export default ProfileRepository;
