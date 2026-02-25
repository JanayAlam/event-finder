import { TEvent, TEventDetail } from "../../server/models/event.model";

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
>;

export type TEventDetailDto = TEventDetail;
