import { TCreateDiscussionDto } from "../../common/validation-schemas/discussion.schemas";
import BaseRepository from "./base.repository";

class DiscussionRepository extends BaseRepository {
  static apiRoute(eventId: string) {
    return `/events/${eventId}/discussions`;
  }

  static async create(eventId: string, body: TCreateDiscussionDto) {
    const url = `${this.apiRoute(eventId)}`;
    const data = await this.request<TCreateDiscussionDto, any>(
      url,
      "post",
      body
    );
    return data;
  }

  static async uploadPhoto(eventId: string, file: File) {
    const url = `${this.apiRoute(eventId)}/upload-photo`;
    const formData = new FormData();
    formData.append("file", file);
    const data = await this.request<FormData, { path: string }>(
      url,
      "post",
      formData
    );
    return data;
  }

  static async removePhoto(eventId: string, path: string) {
    const url = `${this.apiRoute(eventId)}/remove-photo`;
    const data = await this.request<{ path: string }, { message: string }>(
      url,
      "post",
      { path }
    );
    return data;
  }
}

export default DiscussionRepository;
