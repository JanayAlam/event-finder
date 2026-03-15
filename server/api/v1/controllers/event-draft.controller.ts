import { NextFunction, Request, Response } from "express";
import {
  TCreateEventDto,
  TIdParam,
  TUpdateEventDto
} from "../../../../common/types";
import { USER_ROLE } from "../../../enums";
import EventDraftUseCase from "../../../libs/use-cases/event-draft.use-case";
import ApiError from "../../../utils/api-error.util";
import { convertToObjectId } from "../../../utils/object-id.util";

type TEventDraftCreateRequest = Request<any, any, TCreateEventDto>;
type TEventDraftUpdateRequest = Request<TIdParam, any, TUpdateEventDto>;
type TEventDraftIdRequest = Request<TIdParam>;

class EventDraftController {
  static async create(
    req: TEventDraftCreateRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user || req.user.role !== USER_ROLE.HOST) {
        throw new ApiError(401, "Unauthenticated");
      }

      const draftData = {
        ...req.body,
        host: req.user._id,
        members: [req.user._id]
      };

      const draft = await EventDraftUseCase.create(draftData);

      if (!draft) {
        throw new ApiError(500, "Failed to create event draft");
      }

      res.status(201).json(draft);
    } catch (err) {
      next(err);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthenticated");
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const skip = (page - 1) * limit;

      const response = await EventDraftUseCase.getAll({
        filter: { host: req.user._id },
        options: { sort: { updatedAt: -1 }, skip, limit }
      });

      res.status(200).json({
        data: response.data,
        total: response.total,
        totalCount: response.total,
        page: response.page,
        limit: response.limit
      });
    } catch (err) {
      next(err);
    }
  }

  static async getSingle(
    req: TEventDraftIdRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user || req.user.role !== USER_ROLE.HOST) {
        throw new ApiError(401, "Unauthenticated");
      }

      const { id } = req.params;
      const draftId = convertToObjectId(id);
      if (!draftId) {
        throw new ApiError(400, "Invalid draft ID");
      }

      const draft = await EventDraftUseCase.getById(draftId);
      if (!draft) {
        throw new ApiError(404, "Event draft not found");
      }

      const draftHostId = (draft.host as any)._id ?? draft.host;
      if (!draftHostId.equals(req.user._id)) {
        throw new ApiError(403, "Only the draft owner can view this draft");
      }

      res.status(200).json(draft);
    } catch (err) {
      next(err);
    }
  }

  static async update(
    req: TEventDraftUpdateRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user || req.user.role !== USER_ROLE.HOST) {
        throw new ApiError(401, "Unauthenticated");
      }

      const { id } = req.params;
      const draftId = convertToObjectId(id);
      if (!draftId) {
        throw new ApiError(400, "Invalid draft ID");
      }

      const draft = await EventDraftUseCase.getById(draftId);
      if (!draft) {
        throw new ApiError(404, "Event draft not found");
      }

      const draftHostId = (draft.host as any)._id ?? draft.host;
      if (!draftHostId.equals(req.user._id)) {
        throw new ApiError(403, "Only the draft owner can update this draft");
      }

      const updatedDraft = await EventDraftUseCase.update(draftId, req.body);

      if (!updatedDraft) {
        throw new ApiError(500, "Failed to update event draft");
      }

      res.status(200).json(updatedDraft);
    } catch (err) {
      next(err);
    }
  }

  static async delete(
    req: TEventDraftIdRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user || req.user.role !== USER_ROLE.HOST) {
        throw new ApiError(401, "Unauthenticated");
      }

      const { id } = req.params;
      const draftId = convertToObjectId(id);
      if (!draftId) {
        throw new ApiError(400, "Invalid draft ID");
      }

      const draft = await EventDraftUseCase.getById(draftId);
      if (!draft) {
        throw new ApiError(404, "Event draft not found");
      }

      const draftHostId = (draft.host as any)._id ?? draft.host;
      if (!draftHostId.equals(req.user._id)) {
        throw new ApiError(403, "Only the draft owner can delete this draft");
      }

      await EventDraftUseCase.delete(draftId);

      res.status(200).json({ message: "Draft deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

export default EventDraftController;
