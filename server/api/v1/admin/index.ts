import { Router } from "express";
import inputValidator from "../../../middlewares/input-validator";
import {
  AdminLoginDTOSchema,
  ForgetPasswordDTOSchema,
  ResetPasswordDTOParamSchema,
  ResetPasswordDTOSchema,
  SuperAdminCreateDTOSchema
} from "../../../validationSchemas/admin";
import {
  forgetPasswordHandler,
  resetPasswordHandler
} from "./controllers/forget-password-controller";
import {
  adminLoginHandler,
  superAdminRegisterHandler
} from "./controllers/login-register-controller";

const adminRouter = Router();

// register super admin
adminRouter.post(
  "/register",
  inputValidator(SuperAdminCreateDTOSchema),
  superAdminRegisterHandler
);

// admin login [both super and outlet admin]
adminRouter.post(
  "/login",
  inputValidator(AdminLoginDTOSchema),
  adminLoginHandler
);

// admin forget password
adminRouter.post(
  "/forget-password",
  inputValidator(ForgetPasswordDTOSchema),
  forgetPasswordHandler
);

// admin reset password
adminRouter.post(
  "/reset-password/t/:token",
  inputValidator(ResetPasswordDTOSchema, ResetPasswordDTOParamSchema),
  resetPasswordHandler
);

export default adminRouter;
