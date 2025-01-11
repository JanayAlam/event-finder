import { Router } from "express";
import inputValidator from "../../../middlewares/input-validator";
import {
  CustomerEmailLoginDTOSchema,
  CustomerEmailVerifyDTOSchema,
  CustomerPhoneLoginDTOSchema,
  CustomerPhoneVerifyDTOSchema
} from "../../../validationSchemas/customer";
import {
  customerEmailLogin,
  customerPhoneLogin
} from "./controllers/login-controller";
import {
  verifyCustomerEmailAndSendOTP,
  verifyCustomerPhoneAndSendOTP
} from "./controllers/verify-controller";

const customerRouter = Router();

// customer login
customerRouter.post(
  "/verify/email",

  inputValidator(CustomerEmailVerifyDTOSchema),
  verifyCustomerEmailAndSendOTP
);

// customer login
customerRouter.post(
  "/verify/phone",
  inputValidator(CustomerPhoneVerifyDTOSchema),
  verifyCustomerPhoneAndSendOTP
);

// customer login
customerRouter.post(
  "/login/email",
  inputValidator(CustomerEmailLoginDTOSchema),
  customerEmailLogin
);

// customer login
customerRouter.post(
  "/login/phone",
  inputValidator(CustomerPhoneLoginDTOSchema),
  customerPhoneLogin
);

export default customerRouter;
