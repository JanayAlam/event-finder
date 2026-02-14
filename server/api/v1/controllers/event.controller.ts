import { NextFunction, Request, Response } from "express";
import { TEventListItemDto } from "../../../../common/types/event.types";
import {
  TCreateEventDto,
  TIdParam,
  TUpdateEventDto
} from "../../../../common/validation-schemas";
import { postEventToFacebookPage } from "../../../libs/external-services/facebook.service";
import FileUploadService from "../../../libs/external-services/file-upload.service";
import EventUseCase from "../../../libs/use-cases/event.use-case";
import ApiError from "../../../utils/api-error.util";
import { convertToObjectId } from "../../../utils/object-id.util";

type TEventCreateRequest = Request<any, any, TCreateEventDto>;
type TEventUpdateRequest = Request<TIdParam, any, TUpdateEventDto>;
type TEventIdRequest = Request<TIdParam>;

class EventController {
  static async create(
    req: TEventCreateRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthenticated");
      }

      const eventData = {
        ...req.body,
        host: req.user._id,
        members: [req.user._id]
      };

      const event = await EventUseCase.create(eventData as any);

      if (!event) {
        throw new ApiError(500, "Failed to create event");
      }

      res.status(201).json(event);
    } catch (err) {
      next(err);
    }
  }

  static async uploadCoverPhoto(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        throw new ApiError(400, "No file uploaded");
      }

      const uploaded = await FileUploadService.upload(req.file, "event-cover");
      res.status(200).json({ path: uploaded.path });
    } catch (err) {
      next(err);
    }
  }

  static async uploadAdditionalPhoto(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        throw new ApiError(400, "No file uploaded");
      }

      const uploaded = await FileUploadService.upload(
        req.file,
        "event-additional-photos"
      );
      res.status(200).json({ path: uploaded.path });
    } catch (err) {
      next(err);
    }
  }

  static async removePhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const { path: filePath } = req.body;
      if (!filePath) {
        throw new ApiError(400, "File path is required");
      }

      await FileUploadService.remove(filePath);
      res.status(200).json({ message: "Photo removed successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async update(
    req: TEventUpdateRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthenticated");
      }

      const { id } = req.params;

      const event = await EventUseCase.getById(convertToObjectId(id)!);

      if (!event) {
        throw new ApiError(404, "Event not found");
      }

      if (!event.host._id.equals(req.user._id)) {
        throw new ApiError(403, "Only event creator can update event");
      }

      const updatedEvent = await EventUseCase.update(
        convertToObjectId(id)!,
        req.body
      );

      if (!updatedEvent) {
        throw new ApiError(500, "Failed to update event");
      }

      res.status(200).json(updatedEvent);
    } catch (err) {
      next(err);
    }
  }

  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const events = await EventUseCase.getAll({
        projection: {
          title: 1,
          description: 1,
          placeName: 1,
          eventDate: 1,
          entryFee: 1,
          dayCount: 1,
          nightCount: 1,
          memberCapacity: 1,
          host: 1,
          createdAt: 1
        } as any
      });

      const eventList: TEventListItemDto[] = events.map((event) => ({
        _id: event._id,
        title: event.title,
        placeName: event.placeName,
        eventDate: event.eventDate,
        entryFee: event.entryFee,
        dayCount: event.dayCount,
        nightCount: event.nightCount,
        memberCapacity: event.memberCapacity,
        host: event.host
      }));

      res.status(200).json(eventList);
    } catch (err) {
      next(err);
    }
  }

  static async getAllAdmin(_req: Request, res: Response, next: NextFunction) {
    try {
      const events = await EventUseCase.getAll({});

      res.status(200).json(events);
    } catch (err) {
      next(err);
    }
  }

  static async getSingle(
    req: TEventIdRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const event = await EventUseCase.getById(convertToObjectId(id)!);

      if (!event) {
        throw new ApiError(404, "Event not found");
      }

      res.status(200).json(event);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: TEventIdRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthenticated");
      }

      const { id } = req.params;

      const event = await EventUseCase.getById(convertToObjectId(id)!);

      if (!event) {
        throw new ApiError(404, "Event not found");
      }

      if (!event.host._id.equals(req.user._id)) {
        throw new ApiError(403, "Only event creator can delete event");
      }

      await EventUseCase.delete(convertToObjectId(id)!);

      res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async publishToFacebook(
    req: TEventIdRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const event = await EventUseCase.getById(convertToObjectId(id)!);

      if (!event) {
        throw new ApiError(404, "Event not found");
      }

      if (!event.host._id.equals(req.user!._id)) {
        throw new ApiError(
          403,
          "Only event creator can publish event to Facebook"
        );
      }

      if (event.isPostedToFacebook) {
        throw new ApiError(400, "Event has already been posted to Facebook");
      }

      const facebookPost = await postEventToFacebookPage(id.toString());

      res.status(200).json({
        message: "Event posted to Facebook successfully",
        facebookPostId: facebookPost.id
      });
    } catch (err) {
      next(err);
    }
  }
}

export default EventController;
