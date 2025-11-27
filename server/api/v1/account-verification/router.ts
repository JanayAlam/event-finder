import { Router } from "express";
import { USER_ROLE } from "../../../enums";
import { authenticate } from "../../../middlewares/authenticator";
import { getVerificationStatusController } from "./controllers/get-verification-status.controller";

const accountVerificationRouter = Router({ mergeParams: true });

accountVerificationRouter.get(
  "/status",
  authenticate([USER_ROLE.TRAVELER]),
  getVerificationStatusController
);

export default accountVerificationRouter;
