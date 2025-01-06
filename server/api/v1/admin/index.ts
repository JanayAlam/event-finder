import { Router } from "express";
import inputValidator from "../../../middlewares/input-validator";
import {
  AdminLoginDTOSchema,
  ForgetPasswordDTOSchema
} from "../../../validationSchemas/admin";
import { forgetPasswordHandler } from "./controllers/forget-password-controller";
import { adminLoginHandler } from "./controllers/login-controller";

const adminRouter = Router();

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

export default adminRouter;
