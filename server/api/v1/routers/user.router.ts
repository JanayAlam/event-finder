import { Router } from "express";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import { getUserProfileController } from "../controllers/user.controller";

const userRouter = Router({ mergeParams: true });

userRouter.get("/:id/profile", authenticate(), getUserProfileController);

export default userRouter;
