import { Router } from "express";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import * as NotificationController from "../controllers/notification.controller";

const notificationRouter = Router();

notificationRouter.get(
  "/",
  authenticate(),
  NotificationController.getMyNotifications
);
notificationRouter.patch(
  "/mark-as-read",
  authenticate(),
  NotificationController.markAsRead
);
notificationRouter.patch(
  "/:id/mark-as-read",
  authenticate(),
  NotificationController.markAsRead
);

export default notificationRouter;
