import { Router } from "express";
import { authenticate } from "../../../middlewares/authenticator";
import { getUserProfileController } from "./controllers/get-user-profile.controller";

const userRouter = Router({ mergeParams: true });

userRouter.get("/:id/profile", authenticate(), getUserProfileController);

export default userRouter;
