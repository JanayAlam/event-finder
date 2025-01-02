import { Router } from "express";
import inputValidator from "../../../middlewares/inputValidator";
import {
  OutletAdminCreateDTOSchema,
  SuperAdminCreateDTOSchema
} from "../../../validationSchemas/auth";
import {
  outletAdminRegister,
  superAdminRegister,
  userLogin
} from "./authController";

const authRouter = Router();

authRouter.post(
  "/register/super-admin",
  inputValidator(SuperAdminCreateDTOSchema),
  superAdminRegister
);

authRouter.post(
  "/register/outlet-admin",
  inputValidator(OutletAdminCreateDTOSchema),
  outletAdminRegister
);

authRouter.post("/login", userLogin);

export default authRouter;
