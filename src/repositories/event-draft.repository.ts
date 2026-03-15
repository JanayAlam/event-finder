import {
  TCreateEventDto,
  TEvent,
  TEventListItemDto,
  TUpdateEventDto
} from "../../common/types";
import BaseRepository from "./base.repository";

class EventDraftRepository extends BaseRepository {
  static apiRoute = "/event-drafts";

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

  static async update(draftId: string, requestBody: TUpdateEventDto) {
    const url = `${this.apiRoute}/${draftId}`;
    const data = await this.request<TUpdateEventDto, TEvent>(
      url,
      "patch",
      requestBody
    );
    return data;
  }

  static async getAll(page: number = 1, limit: number = 12) {
    const params = new URLSearchParams({
      page: `${page}`,
      limit: `${limit}`
    });

    const url = `${this.apiRoute}?${params.toString()}`;
    const data = await this.request<
      undefined,
      { data: TEventListItemDto[]; total: number; page: number; limit: number }
    >(url, "get");
    return data;
  }

  static async getSingle(draftId: string) {
    const url = `${this.apiRoute}/${draftId}`;
    const data = await this.request<undefined, TEvent>(url, "get");
    return data;
  }

  static async delete(draftId: string) {
    const url = `${this.apiRoute}/${draftId}`;
    const data = await this.request<undefined, { message: string }>(
      url,
      "delete"
    );
    return data;
  }
}

export default EventDraftRepository;
