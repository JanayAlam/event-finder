import { Router } from "express";
import { kindeCallbackController } from "./controllers/kinde-callback.controller";
import { loginController } from "./controllers/login.controller";
import { logoutController } from "./controllers/logout.controller";

const authRouter = Router({ mergeParams: true });

authRouter.get("/login", loginController);
authRouter.get("/callback", kindeCallbackController);

authRouter.get("/logout", logoutController);

export default authRouter;
