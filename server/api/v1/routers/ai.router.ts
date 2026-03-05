import { Router } from "express";
import {
  AiEventCreationSchema,
  PromtScheam
} from "../../../../common/validation-schemas";
import inputValidator from "../../../middlewares/input-validator.middleware";
import AIController from "../controllers/ai.controller";

const aiRouter = Router({ mergeParams: true });

aiRouter.post("/", inputValidator(PromtScheam), AIController.executePromt);

aiRouter.post(
  "/generate-event",
  inputValidator(AiEventCreationSchema),
  AIController.generateEventPlan
);

export default aiRouter;
