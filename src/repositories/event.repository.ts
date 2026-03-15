import {
  TCreateEventDto,
  TEvent,
  TEventDetailDto,
  TEventListItemDto,
  TPaymentResponseDto,
  TSearchEventResultResponse,
  TSearchRequestDto,
  TUpdateEventDto
} from "../../common/types";
import BaseRepository from "./base.repository";

class EventRepository extends BaseRepository {
  static apiRoute = "/events";

  constructor() {
    super();
  }

  static async create(
    requestBody: TCreateEventDto,
    options?: { draftId?: string }
  ) {
    const params = new URLSearchParams();
    if (options?.draftId) {
      params.set("draftId", options.draftId);
    }

    const url = params.toString()
      ? `${this.apiRoute}?${params.toString()}`
      : `${this.apiRoute}`;
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

  static async getAll(
    page: number = 1,
    limit: number = 12,
    filters?: { hostId?: string; memberId?: string }
  ) {
    const params = new URLSearchParams({
      page: `${page}`,
      limit: `${limit}`
    });

    if (filters?.hostId) {
      params.set("hostId", filters.hostId);
    }

    if (filters?.memberId) {
      params.set("memberId", filters.memberId);
    }

    const url = `${this.apiRoute}?${params.toString()}`;
    const data = await this.request<
      undefined,
      { data: TEventListItemDto[]; total: number; page: number; limit: number }
    >(url, "get");
    return data;
  }

  static async getUpcomingEvents() {
    const url = `${this.apiRoute}/upcoming`;
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

  static async getPayments(eventId: string) {
    const url = `${this.apiRoute}/${eventId}/payments`;
    return this.request<undefined, TPaymentResponseDto[]>(url, "get");
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

  static async search(search: string) {
    const url = `${this.apiRoute}/search`;
    return this.request<TSearchRequestDto, TSearchEventResultResponse[]>(
      url,
      "post",
      { search }
    );
  }
}

export default EventRepository;
