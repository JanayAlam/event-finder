import { Router } from "express";
import {
  CreateEventSchema,
  IdParamsSchema,
  UpdateEventSchema
} from "../../../../common/validation-schemas";
import { USER_ROLE } from "../../../enums";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import { imageUpload } from "../../../middlewares/image-upload.middleware";
import inputValidator from "../../../middlewares/input-validator.middleware";
import EventController from "../controllers/event.controller";
import discussionRouter from "./discussion.router";

const eventRouter = Router({ mergeParams: true });

// Discussions sub-router
eventRouter.use("/:id/discussions", discussionRouter);

// Create event - only HOST can create
eventRouter.post(
  "/",
  authenticate([USER_ROLE.HOST]),
  inputValidator(CreateEventSchema),
  EventController.create
);

// Photo upload endpoints
eventRouter.post(
  "/upload/cover",
  authenticate([USER_ROLE.HOST]),
  imageUpload.single("file"),
  EventController.uploadCoverPhoto
);

eventRouter.post(
  "/upload/additional",
  authenticate([USER_ROLE.HOST]),
  imageUpload.single("file"),
  EventController.uploadAdditionalPhoto
);

eventRouter.post(
  "/remove-photo",
  authenticate([USER_ROLE.HOST]),
  EventController.removePhoto
);

// Get all events (admin only) - full details
eventRouter.get(
  "/admin/all",
  authenticate([USER_ROLE.ADMIN]),
  EventController.getAllAdmin
);

// Get upcoming events
eventRouter.get("/upcoming", EventController.getUpcoming);

// Get all events - public list with basic fields
eventRouter.get("/", EventController.getAll);

// Get recent hosted events by user ID
eventRouter.get(
  "/recent/hosted/:id",
  inputValidator(null, IdParamsSchema),
  EventController.getRecentHosted
);

// Get recent joined events by user ID
eventRouter.get(
  "/recent/joined/:id",
  inputValidator(null, IdParamsSchema),
  EventController.getRecentJoined
);

// Publish event to Facebook - only creator (HOST) can publish
eventRouter.post(
  "/:id/publish/facebook",
  authenticate([USER_ROLE.ADMIN, USER_ROLE.HOST]),
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

// Toggle event status - only creator (HOST) can toggle
eventRouter.patch(
  "/:id/status",
  authenticate([USER_ROLE.HOST]),
  inputValidator(null, IdParamsSchema),
  EventController.toggleStatus
);

// Toggle block event - only ADMIN can block
eventRouter.patch(
  "/:id/block",
  authenticate([USER_ROLE.ADMIN]),
  inputValidator(null, IdParamsSchema),
  EventController.toggleBlock
);

// Join event
eventRouter.post(
  "/:id/join",
  authenticate(),
  inputValidator(null, IdParamsSchema),
  EventController.join
);

// Payment callbacks - SSL Commerz POSTs to these, but browser may GET after redirect
eventRouter
  .route("/:id/payment/success")
  .get(inputValidator(null, IdParamsSchema), EventController.paymentSuccess)
  .post(inputValidator(null, IdParamsSchema), EventController.paymentSuccess);

eventRouter
  .route("/:id/payment/fail")
  .get(inputValidator(null, IdParamsSchema), EventController.paymentFail)
  .post(inputValidator(null, IdParamsSchema), EventController.paymentFail);

eventRouter
  .route("/:id/payment/cancel")
  .get(inputValidator(null, IdParamsSchema), EventController.paymentCancel)
  .post(inputValidator(null, IdParamsSchema), EventController.paymentCancel);

export default eventRouter;
