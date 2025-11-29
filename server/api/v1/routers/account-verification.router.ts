import { Router } from "express";
import { InitiateAccountVerificationApiSchema } from "../../../../common/validation-schemas";
import { USER_ROLE } from "../../../enums";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import { imageUpload } from "../../../middlewares/image-upload.middleware";
import inputValidator from "../../../middlewares/input-validator.middleware";
import AccountVerificationController from "../controllers/account-verification.controller";

const accountVerificationRouter = Router({ mergeParams: true });

accountVerificationRouter.get(
  "/status",
  authenticate([USER_ROLE.TRAVELER]),
  AccountVerificationController.status
);

accountVerificationRouter.put(
  "/",
  authenticate([USER_ROLE.TRAVELER]),
  imageUpload.fields([
    { name: "nidFrontImage", maxCount: 1 },
    { name: "nidBackImage", maxCount: 1 },
    { name: "passportImage", maxCount: 1 }
  ]),
  inputValidator(InitiateAccountVerificationApiSchema),
  AccountVerificationController.initiate
);

export default accountVerificationRouter;
