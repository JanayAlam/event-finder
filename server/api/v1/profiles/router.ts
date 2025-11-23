import { Router } from "express";
import {
  IdParamsSchema,
  PersonalInfoRequestSchema
} from "../../../../validation-schemas";
import { authenticate } from "../../../middlewares/authenticator";
import inputValidator from "../../../middlewares/input-validator";
import { updatePersonalInfoController } from "./controllers/update-profile.controller";

const profileRouter = Router();

profileRouter.patch(
  "/:id/personal-info",
  authenticate(),
  inputValidator(PersonalInfoRequestSchema, IdParamsSchema),
  updatePersonalInfoController
);

export default profileRouter;
