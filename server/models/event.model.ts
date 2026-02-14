import { Document, model, Schema, Types } from "mongoose";
import { ITimestamps, ModelWithObjectId } from "../types/common";
import { TProfile } from "./profile.model";
import User, { TUser } from "./user.model";

export type TEventItinerary = {
  moment: Date;
  title: string;
  description?: string;
};

interface EventBase extends ITimestamps {
  host: Types.ObjectId;
  title: string;
  description: string;
  placeName: string;
  eventDate: Date;
  entryFee: number;
  dayCount: number;
  nightCount: number;
  memberCapacity?: number;
  members: Types.ObjectId[];
  itinerary: TEventItinerary[];
  coverPhoto?: string;
  additionalPhotos?: string[];
  facebookPostId?: string;
  isPostedToFacebook: boolean;
}

export interface IEventDoc extends EventBase, Document {
  _id: Types.ObjectId;
}

const itinerarySchema = new Schema<TEventItinerary>(
  {
    moment: { type: Date, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true }
  },
  { _id: false }
);

const eventSchema = new Schema<IEventDoc>(
  {
    host: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
      index: true
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    placeName: { type: String, required: true, trim: true },
    eventDate: { type: Date, required: true },
    entryFee: { type: Number, required: true, min: 0 },
    dayCount: { type: Number, required: true, min: 1 },
    nightCount: { type: Number, required: true, min: 0 },
    memberCapacity: { type: Number, min: 0 },
    members: [{ type: Schema.Types.ObjectId, ref: User, required: true }],
    itinerary: { type: [itinerarySchema], default: [] },
    coverPhoto: { type: String },
    additionalPhotos: { type: [String], default: [] },
    facebookPostId: { type: String },
    isPostedToFacebook: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Event = model<IEventDoc>("events", eventSchema);

export type TEvent = ModelWithObjectId<EventBase>;

export type TUserWithProfile = TUser & { profile: TProfile | null };

export type TEventDetail = Omit<TEvent, "host" | "members"> & {
  host: TUserWithProfile;
  members: TUserWithProfile[];
};

export default Event;
