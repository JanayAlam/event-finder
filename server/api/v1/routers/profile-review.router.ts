import { Router } from "express";
import {
  IdParamsSchema,
  ProfileReviewSchema,
  UpdateProfileReviewSchema
} from "../../../../common/validation-schemas";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import inputValidator from "../../../middlewares/input-validator.middleware";
import ProfileReviewController from "../controllers/profile-review.controller";

const profileReviewRouter = Router({ mergeParams: true });

profileReviewRouter.get(
  "/profiles/:id",
  inputValidator(null, IdParamsSchema),
  ProfileReviewController.getAllReviewsOfProfile
);

profileReviewRouter.post(
  "/",
  authenticate(),
  inputValidator(ProfileReviewSchema),
  ProfileReviewController.create
);

profileReviewRouter.patch(
  "/:id",
  authenticate(),
  inputValidator(UpdateProfileReviewSchema, IdParamsSchema),
  ProfileReviewController.update
);

export default profileReviewRouter;
