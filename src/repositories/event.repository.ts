import {
  TEvent,
  TEventDetailDto,
  TEventListItemDto
} from "../../common/types/event.types";
import {
  TCreateEventDto,
  TUpdateEventDto
} from "../../common/validation-schemas";
import BaseRepository from "./base.repository";

class EventRepository extends BaseRepository {
  static apiRoute = "/events";

  constructor() {
    super();
  }

  static async create(requestBody: TCreateEventDto) {
    const url = `${this.apiRoute}`;
    const data = await this.request<TCreateEventDto, TEvent>(
      url,
      "post",
      requestBody
    );
    return data;
  }

  static async update(eventId: string, requestBody: TUpdateEventDto) {
    const url = `${this.apiRoute}/${eventId}`;
    const data = await this.request<TUpdateEventDto, TEvent>(
      url,
      "patch",
      requestBody
    );
    return data;
  }

  static async getAll() {
    const url = `${this.apiRoute}`;
    const data = await this.request<undefined, TEventListItemDto[]>(url, "get");
    return data;
  }

  static async getUpcomingEvents() {
    const url = `${this.apiRoute}/upcoming`;
    const data = await this.request<undefined, TEventListItemDto[]>(url, "get");
    return data;
  }

  static async getExploreEvents() {
    const url = `${this.apiRoute}/explore`;
    const data = await this.request<undefined, TEventListItemDto[]>(url, "get");
    return data;
  }

  static async getSingle(eventId: string) {
    const url = `${this.apiRoute}/${eventId}`;
    const data = await this.request<undefined, TEventDetailDto>(url, "get");
    return data;
  }

  static async delete(eventId: string) {
    const url = `${this.apiRoute}/${eventId}`;
    const data = await this.request<undefined, { message: string }>(
      url,
      "delete"
    );
    return data;
  }

  static async getAllAdmin() {
    const url = `${this.apiRoute}/admin/all`;
    const data = await this.request<undefined, TEvent[]>(url, "get");
    return data;
  }

  static async uploadCoverPhoto(file: File) {
    const url = `${this.apiRoute}/upload/cover`;
    const formData = new FormData();
    formData.append("file", file);
    const data = await this.request<FormData, { path: string }>(
      url,
      "post",
      formData
    );
    return data;
  }

  static async uploadAdditionalPhoto(file: File) {
    const url = `${this.apiRoute}/upload/additional`;
    const formData = new FormData();
    formData.append("file", file);
    const data = await this.request<FormData, { path: string }>(
      url,
      "post",
      formData
    );
    return data;
  }

  static async removePhoto(path: string) {
    const url = `${this.apiRoute}/remove-photo`;
    const data = await this.request<{ path: string }, { message: string }>(
      url,
      "post",
      { path }
    );
    return data;
  }

  static async getRecentHosted(userId: string) {
    const url = `${this.apiRoute}/recent/hosted/${userId}`;
    const data = await this.request<undefined, TEventListItemDto[]>(url, "get");
    return data;
  }

  static async getRecentJoined(userId: string) {
    const url = `${this.apiRoute}/recent/joined/${userId}`;
    const data = await this.request<undefined, TEventListItemDto[]>(url, "get");
    return data;
  }

  static async join(eventId: string) {
    const url = `${this.apiRoute}/${eventId}/join`;
    const data = await this.request<
      undefined,
      { url?: string; message?: string }
    >(url, "post");
    return data;
  }

  static async publishToFacebook(
    eventId: string
  ): Promise<{ message: string; facebookPostId: string; postUrl?: string }> {
    const url = `${this.apiRoute}/${eventId}/publish/facebook`;
    return this.request(url, "post");
  }

  static async toggleStatus(
    eventId: string
  ): Promise<{ message: string; status: string }> {
    const url = `${this.apiRoute}/${eventId}/status`;
    return this.request(url, "patch");
  }

  static async toggleBlock(
    eventId: string
  ): Promise<{ message: string; status: string }> {
    const url = `${this.apiRoute}/${eventId}/block`;
    return this.request(url, "patch");
  }
}

export default EventRepository;
