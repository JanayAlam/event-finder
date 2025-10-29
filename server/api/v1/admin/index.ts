import { Router } from "express";
import { authenticator } from "../../../middlewares/authenticator";
import {
  forgetPasswordHandler,
  resetPasswordHandler
} from "./controllers/forget-password-controller";
import {
  adminLoginHandler,
  superAdminRegisterHandler
} from "./controllers/login-register-controller";
import {
  blockUserHandler,
  unblockUserHandler
} from "./controllers/user-restriction-controller";

const adminRouter = Router();

// register super admin
adminRouter.post(
  "/register",
  // inputValidator(SuperAdminCreateDTOSchema),
  superAdminRegisterHandler
);

// admin login [both super and outlet admin]
adminRouter.post(
  "/login",
  // inputValidator(AdminLoginDTOSchema),
  adminLoginHandler
);

// admin forget password
adminRouter.post(
  "/forget-password",
  // inputValidator(ForgetPasswordDTOSchema),
  forgetPasswordHandler
);

// block a user
adminRouter.patch(
  "/block-user",
  authenticator([]),
  // inputValidator(BlockUserDTOSchema),
  blockUserHandler
);

// unblock a user
adminRouter.patch(
  "/unblock-user",
  authenticator([]),
  // inputValidator(UnblockUserDTOSchema),
  unblockUserHandler
);

// admin reset password
adminRouter.post(
  "/reset-password/t/:token",
  // inputValidator(ResetPasswordDTOSchema, ResetPasswordDTOParamSchema),
  resetPasswordHandler
);

export default adminRouter;
