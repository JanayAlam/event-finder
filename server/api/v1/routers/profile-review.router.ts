import { Router } from "express";
import { IdParamsSchema } from "../../../../common/validation-schemas";
import inputValidator from "../../../middlewares/input-validator.middleware";
import ProfileReviewController from "../controllers/profiler-review.controller";

const profileReviewRouter = Router({ mergeParams: true });

profileReviewRouter.get(
  "/profiles/:id",
  inputValidator(null, IdParamsSchema),
  ProfileReviewController.getAllReviewsOfProfile
);

export default profileReviewRouter;
