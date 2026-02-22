import {
  TCreateCommentDto,
  TCreateDiscussionDto
} from "../../common/validation-schemas/discussion.schemas";
import { TDiscussionWithProfile } from "../../server/models/discussion.model";
import BaseRepository from "./base.repository";

class DiscussionRepository extends BaseRepository {
  static apiRoute(eventId: string) {
    return `/events/${eventId}/discussions`;
  }

  static async getByEvent(eventId: string) {
    const url = `${this.apiRoute(eventId)}`;
    const data = await this.request<undefined, TDiscussionWithProfile[]>(
      url,
      "get"
    );
    return data;
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

  static async delete(eventId: string, discussionId: string) {
    const url = `${this.apiRoute(eventId)}/${discussionId}`;
    const data = await this.request<undefined, { message: string }>(
      url,
      "delete"
    );
    return data;
  }

  static async toggleUpvote(eventId: string, discussionId: string) {
    const url = `${this.apiRoute(eventId)}/${discussionId}/upvote`;
    const data = await this.request<undefined, { message: string }>(
      url,
      "patch"
    );
    return data;
  }

  static async toggleDownvote(eventId: string, discussionId: string) {
    const url = `${this.apiRoute(eventId)}/${discussionId}/downvote`;
    const data = await this.request<undefined, { message: string }>(
      url,
      "patch"
    );
    return data;
  }

  static async addComment(
    eventId: string,
    discussionId: string,
    body: TCreateCommentDto
  ) {
    const url = `${this.apiRoute(eventId)}/${discussionId}/comments`;
    const data = await this.request<TCreateCommentDto, any>(url, "post", body);
    return data;
  }
}

export default DiscussionRepository;
