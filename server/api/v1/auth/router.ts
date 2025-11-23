import { Router } from "express";
import { RefreshAccessTokenDtoSchema } from "../../../../validation-schemas/auth-schemas";
import { authenticate } from "../../../middlewares/authenticator";
import inputValidator from "../../../middlewares/input-validator";
import {
  getMeController,
  getMyProfileController
} from "./controllers/get-me.controller";
import { kindeCallbackController } from "./controllers/kinde-callback.controller";
import { loginController } from "./controllers/login.controller";
import { logoutController } from "./controllers/logout.controller";
import { refreshAccessTokenController } from "./controllers/refresh-access-token.controller";

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
