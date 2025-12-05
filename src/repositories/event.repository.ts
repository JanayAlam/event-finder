import { TEventListItemDto } from "../../common/types/event.types";
import {
  TCreateEventDto,
  TUpdateEventDto
} from "../../common/validation-schemas";
import { TEvent } from "../../server/models/event.model";
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

  static async getSingle(eventId: string) {
    const url = `${this.apiRoute}/${eventId}`;
    const data = await this.request<undefined, TEvent>(url, "get");
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
}

export default EventRepository;
