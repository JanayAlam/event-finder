import { Router } from "express";
import {
  AIEventCreationSchema,
  PromptSchema
} from "../../../../common/validation-schemas";
import { USER_ROLE } from "../../../enums";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import inputValidator from "../../../middlewares/input-validator.middleware";
import AIController from "../controllers/ai.controller";

const aiRouter = Router({ mergeParams: true });

aiRouter.post(
  "/",
  authenticate(),
  inputValidator(PromptSchema),
  AIController.executePrompt
);

aiRouter.post(
  "/generate-event",
  authenticate([USER_ROLE.HOST]),
  inputValidator(AIEventCreationSchema),
  AIController.generateEventPlan
);

export default aiRouter;
