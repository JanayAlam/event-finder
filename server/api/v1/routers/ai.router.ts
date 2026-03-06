import { Router } from "express";
import {
  AIEventCreationSchema,
  PromptSchema
} from "../../../../common/validation-schemas";
import inputValidator from "../../../middlewares/input-validator.middleware";
import AIController from "../controllers/ai.controller";

const aiRouter = Router({ mergeParams: true });

aiRouter.post("/", inputValidator(PromptSchema), AIController.executePrompt);

aiRouter.post(
  "/generate-event",
  inputValidator(AIEventCreationSchema),
  AIController.generateEventPlan
);

export default aiRouter;
