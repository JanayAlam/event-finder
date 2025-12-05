import { TEvent } from "../../server/models/event.model";

export type TEventListItemDto = Pick<
  TEvent,
  | "_id"
  | "title"
  | "placeName"
  | "eventDate"
  | "entryFee"
  | "dayCount"
  | "nightCount"
  | "host"
>;

export type TEventDetailDto = TEvent;
