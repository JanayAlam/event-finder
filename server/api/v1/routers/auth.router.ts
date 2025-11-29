import { Router } from "express";
import { RefreshAccessTokenDtoSchema } from "../../../../common/validation-schemas";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import inputValidator from "../../../middlewares/input-validator.middleware";
import AuthController from "../controllers/auth.controller";

const authRouter = Router({ mergeParams: true });

authRouter.get("/login", AuthController.login);
authRouter.get("/callback", AuthController.loginCallback);

authRouter.post(
  "/refresh",
  inputValidator(RefreshAccessTokenDtoSchema),
  AuthController.refreshAccessToken
);

authRouter.get("/logout", AuthController.logout);

authRouter.get("/me", authenticate(), AuthController.me);
authRouter.get("/my-profile", authenticate(), AuthController.selfProfile);

export default authRouter;
