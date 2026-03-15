import {
  FilterQuery,
  ProjectionType,
  QueryOptions,
  Types,
  UpdateQuery
} from "mongoose";
import EventDraft, { TEventDraft } from "../../models/event-draft.model";
import { IEventDoc } from "../../models/schemas/event.schema";

type TGetAllEventDraftParamDto = {
  filter?: FilterQuery<IEventDoc>;
  projection?: ProjectionType<IEventDoc>;
  options?: QueryOptions<IEventDoc>;
};

class EventDraftUseCase {
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
  }): Promise<TEventDraft | null> {
    const draft = new EventDraft(data);
    const savedDraft = await draft.save();

    return savedDraft.toObject() as TEventDraft;
  }

  static async getById(id: Types.ObjectId): Promise<TEventDraft | null> {
    return EventDraft.findById(id)
      .populate("host", "firstName lastName email _id")
      .populate("members", "firstName lastName email _id")
      .lean<TEventDraft>()
      .exec();
  }

  static async getAll(params: TGetAllEventDraftParamDto): Promise<{
    data: TEventDraft[];
    total: number;
    page: number;
    limit: number;
  }> {
    const total = await EventDraft.countDocuments(params.filter || {});
    const data = await EventDraft.find(
      { ...params.filter },
      params.projection,
      params.options
    )
      .populate("host", "firstName lastName email _id")
      .lean<TEventDraft[]>()
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
  ): Promise<TEventDraft | null> {
    return EventDraft.findByIdAndUpdate(id, data, { new: true })
      .populate("host", "firstName lastName email _id")
      .populate("members", "firstName lastName email _id")
      .lean<TEventDraft>()
      .exec();
  }

  static async delete(id: Types.ObjectId): Promise<void> {
    await EventDraft.findByIdAndDelete(id).exec();
  }
}

export default EventDraftUseCase;
