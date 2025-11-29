import { Router } from "express";
import {
  IdParamsSchema,
  PersonalInfoRequestSchema
} from "../../../../common/validation-schemas";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import inputValidator from "../../../middlewares/input-validator.middleware";
import ProfileController from "../controllers/profile.controller";

const profileRouter = Router();

profileRouter.patch(
  "/:id/personal-info",
  authenticate(),
  inputValidator(PersonalInfoRequestSchema, IdParamsSchema),
  ProfileController.update
);

export default profileRouter;
