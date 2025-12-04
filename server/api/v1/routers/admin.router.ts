import { Router } from "express";
import { PromoteToHostRequestSchema } from "../../../../common/validation-schemas/admin.schemas";
import { USER_ROLE } from "../../../enums";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import inputValidator from "../../../middlewares/input-validator.middleware";
import AdminController from "../controllers/admin.controller";

const adminRouter = Router({ mergeParams: true });

adminRouter.patch(
  "/promote/host",
  authenticate([USER_ROLE.ADMIN]),
  inputValidator(PromoteToHostRequestSchema),
  AdminController.promoteToHost
);

export default adminRouter;
