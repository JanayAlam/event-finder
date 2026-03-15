import { model } from "mongoose";
import { ModelWithObjectId } from "../types/common";
import { EventBase, IEventDoc, eventSchema } from "./schemas/event.schema";

const EventDraft = model<IEventDoc>("event_drafts", eventSchema);

export type TEventDraft = ModelWithObjectId<EventBase>;

export default EventDraft;
