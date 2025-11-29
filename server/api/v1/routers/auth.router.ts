import { Router } from "express";
import { RefreshAccessTokenDtoSchema } from "../../../../common/validation-schemas";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import inputValidator from "../../../middlewares/input-validator.middleware";
import {
  getMeController,
  getMyProfileController,
  kindeCallbackController,
  loginController,
  logoutController,
  refreshAccessTokenController
} from "../controllers/auth.controller";

const authRouter = Router({ mergeParams: true });

authRouter.get("/login", loginController);
authRouter.get("/callback", kindeCallbackController);
authRouter.post(
  "/refresh",
  inputValidator(RefreshAccessTokenDtoSchema),
  refreshAccessTokenController
);

authRouter.get("/logout", logoutController);

authRouter.get("/me", authenticate(), getMeController);
authRouter.get("/my-profile", authenticate(), getMyProfileController);

export default authRouter;
