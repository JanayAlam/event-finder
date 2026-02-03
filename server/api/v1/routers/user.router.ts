import { Router } from "express";
import { USER_ROLE } from "../../../enums";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import UserController from "../controllers/user.controller";

const userRouter = Router({ mergeParams: true });

userRouter.get("/:id/profile", authenticate(), UserController.profile);

// Admin routes
userRouter.get("/", authenticate([USER_ROLE.ADMIN]), UserController.list);
userRouter.patch(
  "/:id/block",
  authenticate([USER_ROLE.ADMIN]),
  UserController.block
);
userRouter.patch(
  "/:id/unblock",
  authenticate([USER_ROLE.ADMIN]),
  UserController.unblock
);

export default userRouter;
