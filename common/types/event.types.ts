import { z } from "zod";
import { TEvent, TEventDetail } from "../../server/models/event.model";
import { CreateEventSchema, UpdateEventSchema } from "../validation-schemas";

export type { TEvent };

export type TEventListItemDto = Pick<
  TEvent,
  | "_id"
  | "title"
  | "placeName"
  | "eventDate"
  | "entryFee"
  | "dayCount"
  | "nightCount"
  | "memberCapacity"
  | "host"
  | "coverPhoto"
  | "status"
  | "createdAt"
>;

export type TEventDetailDto = TEventDetail;

export type TCreateEventDto = z.output<typeof CreateEventSchema>;
export type TCreateEventForm = z.input<typeof CreateEventSchema>;
export type TUpdateEventDto = z.output<typeof UpdateEventSchema>;
export type TUpdateEventForm = z.input<typeof UpdateEventSchema>;

export type TSearchEventResultResponse = {
  _id: string;
  title: string;
  placeName: string;
  eventDate: Date;
};

export type TSearchRequestDto = {
  search: string;
};
