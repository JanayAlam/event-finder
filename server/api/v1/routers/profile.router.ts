import { Router } from "express";
import {
  IdParamsSchema,
  PersonalInfoRequestSchema
} from "../../../../common/validation-schemas";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import inputValidator from "../../../middlewares/input-validator.middleware";
import { updatePersonalInfoController } from "../controllers/profile.controller";

const profileRouter = Router();

profileRouter.patch(
  "/:id/personal-info",
  authenticate(),
  inputValidator(PersonalInfoRequestSchema, IdParamsSchema),
  updatePersonalInfoController
);

export default profileRouter;
