import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import {
  AIEventCreationSchema,
  PromptSchema
} from "../../../../common/validation-schemas";
import { USER_ROLE } from "../../../enums";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import inputValidator from "../../../middlewares/input-validator.middleware";
import AIController from "../controllers/ai.controller";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 2, // Limit each IP to 2 requests per `window` (here, per 1 minute).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56 // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
});

const aiRouter = Router({ mergeParams: true });

aiRouter.use(limiter);

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
