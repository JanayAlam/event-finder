import { USER_ROLE } from "@prisma/client";
import { Router } from "express";
import { authenticator } from "../../../middlewares/authenticator";
import inputValidator from "../../../middlewares/inputValidator";
import {
  AdminLoginDTOSchema,
  CustomerEmailLoginDTOSchema,
  CustomerEmailVerifyDTOSchema,
  CustomerPhoneLoginDTOSchema,
  CustomerPhoneVerifyDTOSchema,
  OutletAdminCreateDTOSchema,
  SuperAdminCreateDTOSchema
} from "../../../validationSchemas/auth";
import { getAuthUser } from "./controllers/authUserController";
import {
  adminLogin,
  customerEmailLogin,
  customerPhoneLogin
} from "./controllers/loginController";
import {
  outletAdminRegister,
  superAdminRegister
} from "./controllers/registerController";
import {
  verifyCustomerEmailAndSendOTP,
  verifyCustomerPhoneAndSendOTP
} from "./controllers/verifyController";

const authRouter = Router();

authRouter.get(
  "/user",
  authenticator([
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.OUTLET_ADMIN,
    USER_ROLE.CUSTOMER
  ]),
  getAuthUser
);

authRouter.post(
  "/login/admin",
  inputValidator(AdminLoginDTOSchema),
  adminLogin
);

authRouter.post(
  "/register/admin/super-admin",
  inputValidator(SuperAdminCreateDTOSchema),
  superAdminRegister
);

authRouter.post(
  "/register/admin/outlet-admin",
  authenticator([USER_ROLE.SUPER_ADMIN]),
  inputValidator(OutletAdminCreateDTOSchema),
  outletAdminRegister
);

// authRouter.post(
//   "/customer/verify/phone",
//   inputValidator(CustomerPhoneVerifyDTOSchema),
//   adminLogin
// );

authRouter.post(
  "/customer/verify/email",
  inputValidator(CustomerEmailVerifyDTOSchema),
  verifyCustomerEmailAndSendOTP
);

authRouter.post(
  "/customer/verify/phone",
  inputValidator(CustomerPhoneVerifyDTOSchema),
  verifyCustomerPhoneAndSendOTP
);

authRouter.post(
  "/login/customer/email",
  inputValidator(CustomerEmailLoginDTOSchema),
  customerEmailLogin
);

authRouter.post(
  "/login/customer/phone",
  inputValidator(CustomerPhoneLoginDTOSchema),
  customerPhoneLogin
);

export default authRouter;
