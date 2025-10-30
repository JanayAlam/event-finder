import { Router } from "express";
import { authenticate } from "../../../middlewares/authenticator";
import { authSyncController } from "./controllers/auth-sync.controller";
import { kindeCallbackController } from "./controllers/kinde-callback.controller";
import { loginController } from "./controllers/login.controller";
import { logoutController } from "./controllers/logout.controller";

const authRouter = Router({ mergeParams: true });

authRouter.get("/login", loginController);
authRouter.get("/callback", kindeCallbackController);

authRouter.post("/sync", authenticate(), authSyncController);

authRouter.get("/logout", logoutController);

export default authRouter;
