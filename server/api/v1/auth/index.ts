import { USER_ROLE } from "@prisma/client";
import { Router } from "express";
import { authenticator } from "../../../middlewares/authenticator";
import inputValidator from "../../../middlewares/input-validator";
import { uploadSingleFile } from "../../../middlewares/multer-config";
import {
  CustomerEmailLoginDTOSchema,
  CustomerEmailVerifyDTOSchema,
  CustomerPhoneLoginDTOSchema,
  CustomerPhoneVerifyDTOSchema,
  UpdateUserInfoDTOSchema,
  UpdateUserPasswordDTOSchema
} from "../../../validationSchemas/auth";
import {
  getAuthUser,
  updateAuthUserInfo,
  updateAuthUserPassword,
  updateAuthUserPhoto
} from "./controllers/auth-user-controller";
import {
  customerEmailLogin,
  customerPhoneLogin
} from "./controllers/login-controller";
import {
  verifyCustomerEmailAndSendOTP,
  verifyCustomerPhoneAndSendOTP
} from "./controllers/verify-controller";

const authRouter = Router();

// get auth user
authRouter.get(
  "/user",
  authenticator([
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.OUTLET_ADMIN,
    USER_ROLE.CUSTOMER
  ]),
  getAuthUser
);

// change names
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
// change profile photo
authRouter.patch(
  "/user/update/photo",
  authenticator([
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.OUTLET_ADMIN,
    USER_ROLE.CUSTOMER
  ]),
  uploadSingleFile, //!
  updateAuthUserPhoto
);

// change password
authRouter.patch(
  "/user/update/password",
  authenticator([USER_ROLE.SUPER_ADMIN, USER_ROLE.OUTLET_ADMIN]),
  inputValidator(UpdateUserPasswordDTOSchema),
  updateAuthUserPassword
);

// customer login
authRouter.post(
  "/customer/verify/email",
  inputValidator(CustomerEmailVerifyDTOSchema),
  verifyCustomerEmailAndSendOTP
);

// customer login
authRouter.post(
  "/customer/verify/phone",
  inputValidator(CustomerPhoneVerifyDTOSchema),
  verifyCustomerPhoneAndSendOTP
);

// customer login
authRouter.post(
  "/login/customer/email",
  inputValidator(CustomerEmailLoginDTOSchema),
  customerEmailLogin
);

// customer login
authRouter.post(
  "/login/customer/phone",
  inputValidator(CustomerPhoneLoginDTOSchema),
  customerPhoneLogin
);

export default authRouter;
