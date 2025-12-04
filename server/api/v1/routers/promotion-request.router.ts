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

export default promotionRequestRouter;
