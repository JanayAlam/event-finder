import { Router } from "express";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import UserController from "../controllers/user.controller";

const userRouter = Router({ mergeParams: true });

userRouter.get("/:id/profile", authenticate(), UserController.profile);

export default userRouter;
