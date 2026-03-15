import { FilterQuery } from "mongoose";
import {
  TAISearchEvent,
  TEventSearchToolDto
} from "../../../common/types/ai.types";
import { EVENT_STATUS } from "../../enums";
import Event from "../../models/event.model";
import { IEventDoc } from "../../models/schemas/event.schema";

class AIUseCase {
  static async searchEvents(
    params: TEventSearchToolDto
  ): Promise<TAISearchEvent[]> {
    const {
      locations,
      number_of_members,
      start_date,
      end_date,
      budget,
      day_count,
      night_count
    } = params;

    const filter: FilterQuery<IEventDoc> = {
      status: EVENT_STATUS.OPEN
    };

    if (locations?.length) {
      filter.$or = locations.flatMap((loc) => {
        const regex = loc
          .replace(/[^a-zA-Z0-9]/g, "")
          .split("")
          .map((c) => `${c}[^a-zA-Z0-9]*`)
          .join("");

        return [
          { placeName: { $regex: regex, $options: "i" } },
          { title: { $regex: regex, $options: "i" } }
        ];
      });
    }

    if (number_of_members) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { memberCapacity: { $exists: false } },
          { memberCapacity: null },
          {
            $expr: {
              $gte: [
                {
                  $subtract: [
                    { $ifNull: ["$memberCapacity", 999] },
                    { $size: "$members" }
                  ]
                },
                number_of_members
              ]
            }
          }
        ]
      });
    }

    if (budget) {
      filter.entryFee = { $lte: budget + 1000 };
    }

    if (day_count) {
      filter.dayCount = { $gte: day_count };
    }

    if (night_count) {
      filter.nightCount = { $gte: night_count };
    }

    if (start_date || end_date) {
      filter.eventDate = {};
      if (start_date) {
        filter.eventDate.$gte = new Date(start_date);
      }
      if (end_date) {
        filter.eventDate.$lte = new Date(end_date);
      }
    }

    const events = await Event.find(filter, {
      _id: true,
      title: true,
      description: true,
      placeName: true,
      eventDate: true,
      entryFee: true,
      dayCount: true,
      nightCount: true,
      memberCapacity: true,
      status: true,
      createdAt: true,
      updatedAt: true
    })
      .lean<TAISearchEvent[]>()
      .exec();

    return events;
  }
}

export default AIUseCase;
