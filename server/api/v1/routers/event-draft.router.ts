import { Router } from "express";
import {
  CreateEventSchema,
  IdParamsSchema,
  UpdateEventSchema
} from "../../../../common/validation-schemas";
import { USER_ROLE } from "../../../enums";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import inputValidator from "../../../middlewares/input-validator.middleware";
import EventDraftController from "../controllers/event-draft.controller";

const eventDraftRouter = Router({ mergeParams: true });

// Create draft - only HOST
eventDraftRouter.post(
  "/",
  authenticate([USER_ROLE.HOST]),
  inputValidator(CreateEventSchema),
  EventDraftController.create
);

// Get all drafts for current host
eventDraftRouter.get(
  "/",
  authenticate([USER_ROLE.HOST]),
  EventDraftController.getAll
);

// Get single draft
eventDraftRouter.get(
  "/:id",
  authenticate([USER_ROLE.HOST]),
  inputValidator(null, IdParamsSchema),
  EventDraftController.getSingle
);

// Update draft
eventDraftRouter.patch(
  "/:id",
  authenticate([USER_ROLE.HOST]),
  inputValidator(UpdateEventSchema, IdParamsSchema),
  EventDraftController.update
);

// Delete draft
eventDraftRouter.delete(
  "/:id",
  authenticate([USER_ROLE.HOST]),
  inputValidator(null, IdParamsSchema),
  EventDraftController.delete
);

export default eventDraftRouter;
