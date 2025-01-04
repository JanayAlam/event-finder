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
  SuperAdminCreateDTOSchema,
  UpdateUserInfoDTOSchema,
  UpdateUserPasswordDTOSchema
} from "../../../validationSchemas/auth";
import {
  getAuthUser,
  updateAuthUserInfo,
  updateAuthUserPassword
} from "./controllers/authUserController";
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

/**
 * - TODO -
 * 1. Block/Unblock any user (Super Admin)
 * 2. Change password of outlet admin (Super Admin)
 * 3. Forget/Reset Password
 * 4. Upload/Remove profile photo
 */

authRouter.get(
  "/user",
  authenticator([
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.OUTLET_ADMIN,
    USER_ROLE.CUSTOMER
  ]),
  getAuthUser
);

authRouter.patch(
  "/user/update/info",
  authenticator([
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.OUTLET_ADMIN,
    USER_ROLE.CUSTOMER
  ]),
  inputValidator(UpdateUserInfoDTOSchema),
  updateAuthUserInfo
);

authRouter.patch(
  "/user/update/password",
  authenticator([USER_ROLE.SUPER_ADMIN, USER_ROLE.OUTLET_ADMIN]),
  inputValidator(UpdateUserPasswordDTOSchema),
  updateAuthUserPassword
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
