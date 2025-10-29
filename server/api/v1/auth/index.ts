import { Router } from "express";
import { authenticator } from "../../../middlewares/authenticator";
import inputValidator from "../../../middlewares/input-validator";
import { uploadImages } from "../../../middlewares/multer-config";
import {
  UpdateUserInfoDTOSchema,
  UpdateUserPasswordDTOSchema
} from "../../../validationSchemas/auth";
import {
  getAuthUser,
  updateAuthUserInfo,
  updateAuthUserPassword,
  updateAuthUserPhoto
} from "./controllers/auth-user-controller";
import { logoutHandler } from "./controllers/logout";

const authRouter = Router();

// get auth user
authRouter.delete("/logout", logoutHandler);

// get auth user
authRouter.get(
  "/user",
  authenticator([]),
  getAuthUser
);

// change names
authRouter.patch(
  "/user/update/info",
  authenticator([
    
  ]),
  inputValidator(UpdateUserInfoDTOSchema),
  updateAuthUserInfo
);

// change profile photo
authRouter.patch(
  "/user/update/photo",
  authenticator([
    
  ]),
  uploadImages.single("profilePhoto"),
  updateAuthUserPhoto
);

// change password
authRouter.patch(
  "/user/update/password",
  authenticator([]),
  inputValidator(UpdateUserPasswordDTOSchema),
  updateAuthUserPassword
);

export default authRouter;
