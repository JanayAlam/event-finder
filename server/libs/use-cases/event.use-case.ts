import {
  FilterQuery,
  ProjectionType,
  QueryOptions,
  Types,
  UpdateQuery
} from "mongoose";
import Event, { IEventDoc, TEvent } from "../../models/event.model";

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

  static async getById(id: Types.ObjectId): Promise<TEvent | null> {
    return Event.findById(id)
      .populate("host", "firstName lastName email _id")
      .populate("members", "firstName lastName email _id")
      .lean<TEvent>()
      .exec();
  }

  static async getAll(params: TGetAllEventParamDto): Promise<TEvent[]> {
    return Event.find({ ...params.filter }, params.projection, params.options)
      .populate("host", "firstName lastName email _id")
      .lean<TEvent[]>()
      .exec();
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
}

export default EventUseCase;
