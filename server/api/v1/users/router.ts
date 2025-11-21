import { Router } from "express";
import { authenticate } from "../../../middlewares/authenticator";
import { getProfileController } from "./controllers/get-profile.controller";

const userRouter = Router({ mergeParams: true });

userRouter.get("/:id/profile", authenticate(), getProfileController);

export default userRouter;
