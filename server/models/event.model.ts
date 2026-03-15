import { model } from "mongoose";
import { ModelWithObjectId } from "../types/common";
import { EventBase, IEventDoc, eventSchema } from "./schemas/event.schema";
import { TUserWithProfile } from "./user.model";

const Event = model<IEventDoc>("events", eventSchema);

export type TEvent = ModelWithObjectId<EventBase>;

export type TEventDetail = Omit<TEvent, "host" | "members"> & {
  host: TUserWithProfile;
  members: TUserWithProfile[];
};

export default Event;
