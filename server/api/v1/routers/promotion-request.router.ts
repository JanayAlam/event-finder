import { Router } from "express";
import { USER_ROLE } from "../../../enums";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import PromotionRequestController from "../controllers/promotion-request.controller";

const promotionRequestRouter = Router({ mergeParams: true });

promotionRequestRouter.post(
  "/",
  authenticate([USER_ROLE.TRAVELER]),
  PromotionRequestController.request
);

promotionRequestRouter.get(
  "/",
  authenticate([USER_ROLE.ADMIN]),
  PromotionRequestController.allPendingRequests
);

promotionRequestRouter.patch(
  "/:promotionRequestId/accept",
  authenticate([USER_ROLE.ADMIN]),
  PromotionRequestController.acceptPromotionRequest
);

promotionRequestRouter.patch(
  "/:promotionRequestId/reject",
  authenticate([USER_ROLE.ADMIN]),
  PromotionRequestController.rejectPromotionRequest
);

export default promotionRequestRouter;
