import { Router } from "express";
import { USER_ROLE } from "../../../enums";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import { imageUpload } from "../../../middlewares/image-upload.middleware";
import AccountVerificationController from "../controllers/account-verification.controller";

const accountVerificationRouter = Router({ mergeParams: true });

accountVerificationRouter.get(
  "/status",
  authenticate(),
  AccountVerificationController.status
);

accountVerificationRouter.put(
  "/",
  authenticate([USER_ROLE.TRAVELER, USER_ROLE.HOST]),
  imageUpload.fields([
    { name: "nidFrontImage", maxCount: 1 },
    { name: "nidBackImage", maxCount: 1 },
    { name: "passportImage", maxCount: 1 }
  ]),
  AccountVerificationController.initiate
);

accountVerificationRouter.get(
  "/pending-reviews",
  authenticate([USER_ROLE.ADMIN]),
  AccountVerificationController.pendingReviews
);

accountVerificationRouter.patch(
  "/:accountVerificationId/accept",
  authenticate([USER_ROLE.ADMIN]),
  AccountVerificationController.acceptRequest
);

accountVerificationRouter.patch(
  "/:accountVerificationId/decline",
  authenticate([USER_ROLE.ADMIN]),
  AccountVerificationController.declineRequest
);

export default accountVerificationRouter;
