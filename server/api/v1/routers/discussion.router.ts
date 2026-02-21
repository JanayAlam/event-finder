import { Router } from "express";
import {
  CreateCommentSchema,
  CreateDiscussionSchema
} from "../../../../common/validation-schemas";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import inputValidator from "../../../middlewares/input-validator.middleware";
import DiscussionController from "../controllers/discussion.controller";

const discussionRouter = Router({ mergeParams: true });

// All discussion routes require authentication
discussionRouter.use(authenticate());

discussionRouter.get("/", DiscussionController.getByEvent);

discussionRouter.post(
  "/",
  inputValidator(CreateDiscussionSchema),
  DiscussionController.create
);

discussionRouter.post(
  "/:discussionId/comments",
  inputValidator(CreateCommentSchema),
  DiscussionController.addComment
);

discussionRouter.patch(
  "/:discussionId/upvote",
  DiscussionController.toggleUpvote
);

discussionRouter.patch(
  "/:discussionId/downvote",
  DiscussionController.toggleDownvote
);

discussionRouter.delete("/:discussionId", DiscussionController.delete);

export default discussionRouter;
