import { NextFunction, Request, Response } from "express";
import {
  TCreateCommentDto,
  TCreateDiscussionDto
} from "../../../../common/validation-schemas";
import FileUploadService from "../../../libs/external-services/file-upload.service";
import DiscussionUseCase from "../../../libs/use-cases/discussion.use-case";
import EventUseCase from "../../../libs/use-cases/event.use-case";
import { getProfileByUserId } from "../../../libs/use-cases/profile.use-case";
import ApiError from "../../../utils/api-error.util";
import { convertToObjectId } from "../../../utils/object-id.util";

class DiscussionController {
  private static async getProfileOrThrow(userId: any) {
    const profile = await getProfileByUserId(userId);
    if (!profile) {
      throw new ApiError(
        404,
        "User profile not found. Please complete your profile."
      );
    }
    return profile;
  }

  private static async checkParticipation(eventId: string, userId: any) {
    const event = await EventUseCase.getById(convertToObjectId(eventId)!);
    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    const isHost = event.host._id.toString() === userId.toString();
    const isMember = event.members.some(
      (m: any) => m._id.toString() === userId.toString()
    );

    if (!isHost && !isMember) {
      throw new ApiError(
        403,
        "Only host and joined members can access discussions"
      );
    }
  }

  static async uploadPhoto(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new ApiError(400, "No file uploaded");
      }

      const uploaded = await FileUploadService.upload(
        req.file,
        "discussion-photos"
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

  static async create(
    req: Request<{ id: string }, any, TCreateDiscussionDto>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id: eventId } = req.params;
      const userId = req.user?._id;

      await DiscussionController.checkParticipation(eventId, userId);

      const profile = await DiscussionController.getProfileOrThrow(userId);

      const discussion = await DiscussionUseCase.create({
        ...req.body,
        event: convertToObjectId(eventId)!,
        creatorProfile: profile._id
      });

      res.status(201).json(discussion);
    } catch (err) {
      next(err);
    }
  }

  static async getByEvent(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id: eventId } = req.params;
      const userId = req.user?._id;

      await DiscussionController.checkParticipation(eventId, userId);

      const discussions = await DiscussionUseCase.getByEventId(
        convertToObjectId(eventId)!
      );
      res.status(200).json(discussions);
    } catch (err) {
      next(err);
    }
  }

  static async addComment(
    req: Request<{ id: string; discussionId: string }, any, TCreateCommentDto>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id: eventId, discussionId } = req.params;
      const userId = req.user?._id;

      await DiscussionController.checkParticipation(eventId, userId);

      const profile = await DiscussionController.getProfileOrThrow(userId);

      const updatedDiscussion = await DiscussionUseCase.addComment(
        convertToObjectId(discussionId)!,
        {
          creatorProfile: profile._id,
          content: req.body.content
        }
      );

      res.status(200).json(updatedDiscussion);
    } catch (err) {
      next(err);
    }
  }

  static async toggleUpvote(
    req: Request<{ id: string; discussionId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id: eventId, discussionId } = req.params;
      const userId = req.user?._id;

      await DiscussionController.checkParticipation(eventId, userId);

      const profile = await DiscussionController.getProfileOrThrow(userId);

      const updatedDiscussion = await DiscussionUseCase.toggleUpvote(
        convertToObjectId(discussionId)!,
        profile._id
      );

      res.status(200).json(updatedDiscussion);
    } catch (err) {
      next(err);
    }
  }

  static async toggleDownvote(
    req: Request<{ id: string; discussionId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id: eventId, discussionId } = req.params;
      const userId = req.user?._id;

      await DiscussionController.checkParticipation(eventId, userId);

      const profile = await DiscussionController.getProfileOrThrow(userId);

      const updatedDiscussion = await DiscussionUseCase.toggleDownvote(
        convertToObjectId(discussionId)!,
        profile._id
      );

      res.status(200).json(updatedDiscussion);
    } catch (err) {
      next(err);
    }
  }

  static async delete(
    req: Request<{ id: string; discussionId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id: eventId, discussionId } = req.params;
      const userId = req.user?._id;

      await DiscussionController.checkParticipation(eventId, userId);

      const profile = await DiscussionController.getProfileOrThrow(userId);

      await DiscussionUseCase.delete(
        convertToObjectId(discussionId)!,
        profile._id
      );

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default DiscussionController;
