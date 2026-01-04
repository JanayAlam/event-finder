import { Router } from "express";
import {
  CreateEventSchema,
  IdParamsSchema,
  UpdateEventSchema
} from "../../../../common/validation-schemas";
import { USER_ROLE } from "../../../enums";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import inputValidator from "../../../middlewares/input-validator.middleware";
import EventController from "../controllers/event.controller";

const eventRouter = Router({ mergeParams: true });

// Create event - only HOST can create
eventRouter.post(
  "/",
  authenticate([USER_ROLE.HOST]),
  inputValidator(CreateEventSchema),
  EventController.create
);

// Get all events (admin only) - full details
eventRouter.get(
  "/admin/all",
  authenticate([USER_ROLE.ADMIN]),
  EventController.getAllAdmin
);

// Get all events - public list with basic fields
eventRouter.get("/", EventController.getAll);

// Publish event to Facebook - only creator (HOST) can publish
eventRouter.post(
  "/:id/publish/facebook",
  authenticate([USER_ROLE.HOST]),
  inputValidator(null, IdParamsSchema),
  EventController.publishToFacebook
);

// Get single event - everyone can view
eventRouter.get(
  "/:id",
  inputValidator(null, IdParamsSchema),
  EventController.getSingle
);

// Update event - only creator (HOST) can update
eventRouter.patch(
  "/:id",
  authenticate([USER_ROLE.HOST]),
  inputValidator(UpdateEventSchema, IdParamsSchema),
  EventController.update
);

// Delete event - only creator (HOST) can delete
eventRouter.delete(
  "/:id",
  authenticate([USER_ROLE.HOST]),
  inputValidator(null, IdParamsSchema),
  EventController.delete
);

export default eventRouter;
