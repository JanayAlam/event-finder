import { Router } from "express";
import {
  IdParamsSchema,
  PersonalInfoRequestSchema
} from "../../../../common/validation-schemas";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import { imageUpload } from "../../../middlewares/image-upload.middleware";
import inputValidator from "../../../middlewares/input-validator.middleware";
import ProfileController from "../controllers/profile.controller";

const profileRouter = Router();

profileRouter.get(
  "/:id",
  inputValidator(null, IdParamsSchema),
  ProfileController.getById
);

profileRouter.get(
  "/:id/trips-status",
  inputValidator(null, IdParamsSchema),
  ProfileController.getTripStatus
);

profileRouter.patch(
  "/:id/personal-info",
  authenticate(),
  inputValidator(PersonalInfoRequestSchema, IdParamsSchema),
  ProfileController.update
);

profileRouter.post(
  "/:id/profile-image",
  authenticate(),
  imageUpload.single("profileImage"),
  ProfileController.uploadProfileImage
);

profileRouter.delete(
  "/:id/profile-image",
  authenticate(),
  inputValidator(null, IdParamsSchema),
  ProfileController.removeProfileImage
);

export default profileRouter;
