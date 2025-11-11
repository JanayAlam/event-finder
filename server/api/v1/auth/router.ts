import { Router } from "express";
import { authenticate } from "../../../middlewares/authenticator";
import inputValidator from "../../../middlewares/input-validator";
import { RefreshAccessTokenDtoSchema } from "../../../validationSchemas/auth";
import { getAuthenticatedUserController } from "./controllers/get-authenticated-user.controller";
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

authRouter.get("/me", authenticate(), getAuthenticatedUserController);

export default authRouter;
