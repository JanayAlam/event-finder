import {
  FilterQuery,
  ProjectionType,
  QueryOptions,
  Types,
  UpdateQuery
} from "mongoose";
import { TSearchEventResultResponse } from "../../../common/types";
import Event, {
  IEventDoc,
  TEvent,
  TEventDetail
} from "../../models/event.model";

type TGetAllEventParamDto = {
  filter?: FilterQuery<IEventDoc>;
  projection?: ProjectionType<IEventDoc>;
  options?: QueryOptions<IEventDoc>;
};

class EventUseCase {
  static async create(data: {
    host: Types.ObjectId;
    title: string;
    description: string;
    placeName: string;
    eventDate: Date;
    entryFee: number;
    dayCount: number;
    nightCount: number;
    memberCapacity?: number;
    itinerary?: Array<{
      moment: Date;
      title: string;
      description?: string;
    }>;
    coverPhoto?: string;
    additionalPhotos?: string[];
    members?: Types.ObjectId[];
  }): Promise<TEvent | null> {
    const event = new Event(data);
    const savedEvent = await event.save();

    return savedEvent.toObject() as TEvent;
  }

  static async getById(id: Types.ObjectId): Promise<TEventDetail | null> {
    const event = await Event.findById(id)
      .populate({
        path: "host",
        populate: { path: "profile", select: "-__v" }
      })
      .populate({
        path: "members",
        populate: { path: "profile", select: "-__v" }
      })
      .lean<TEventDetail>()
      .exec();

    if (event && !event.coverPhoto) {
      (event as any).coverPhoto = null;
    }

    return event;
  }

  static async getAll(params: TGetAllEventParamDto): Promise<{
    data: TEvent[];
    total: number;
    page: number;
    limit: number;
  }> {
    const total = await Event.countDocuments(params.filter || {});
    const data = await Event.find(
      { ...params.filter },
      params.projection,
      params.options
    )
      .populate("host", "firstName lastName email _id")
      .lean<TEvent[]>()
      .exec();

    return {
      data,
      total,
      page: params.options?.skip
        ? Math.floor(params.options.skip / (params.options.limit || 10)) + 1
        : 1,
      limit: params.options?.limit || 10
    };
  }

  static async update(
    id: Types.ObjectId,
    data: UpdateQuery<IEventDoc>
  ): Promise<TEvent | null> {
    return Event.findByIdAndUpdate(id, data, { new: true })
      .populate("host", "firstName lastName email _id")
      .populate("members", "firstName lastName email _id")
      .lean<TEvent>()
      .exec();
  }

  static async delete(id: Types.ObjectId): Promise<void> {
    await Event.findByIdAndDelete(id).exec();
  }

  static async getEventsByHost(hostId: Types.ObjectId): Promise<TEvent[]> {
    return Event.find({ host: hostId })
      .populate("host", "firstName lastName email _id")
      .lean<TEvent[]>()
      .exec();
  }

  static async isEventHost(
    eventId: Types.ObjectId,
    userId: Types.ObjectId
  ): Promise<boolean> {
    const event = await Event.findById(eventId).select("host").lean().exec();
    return event?.host.equals(userId) ?? false;
  }

  static async search(query: string): Promise<TSearchEventResultResponse[]> {
    const cleanQuery = query.replace(/[^a-zA-Z0-9]/g, "");
    if (!cleanQuery) {
      return [];
    }

    const regexSource = cleanQuery
      .split("")
      .map((c) => `${c}[^a-zA-Z0-9]*`)
      .join("");
    const regex = new RegExp(regexSource, "i");

    return Event.find({
      $or: [{ title: { $regex: regex } }, { placeName: { $regex: regex } }]
    })
      .select("title placeName eventDate _id")
      .limit(10)
      .lean<TSearchEventResultResponse[]>()
      .exec();
  }
}

export default EventUseCase;
