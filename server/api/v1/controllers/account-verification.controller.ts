import { NextFunction, Request, Response } from "express";
import { assert } from "node:console";
import {
  TVerificationStatusResponse,
  VERIFICATION_STATUS
} from "../../../../common/types";
import { TAccountVerificationRequestDto } from "../../../../common/validation-schemas";
import {
  ACCOUNT_VERIFICATION_STATUS,
  TAccountVerificationStatus
} from "../../../enums";
import notificationEventEmitter from "../../../events/emitters/notification.event-emitter";
import FileUploadService from "../../../libs/external-services/file-upload.service";
import AccountVerificationUseCase, {
  IUpdateAccountVerificationDto
} from "../../../libs/use-cases/account-verification.use-case";
import UserUseCase from "../../../libs/use-cases/user.use-case";
import ApiError from "../../../utils/api-error.util";
import { convertToObjectId } from "../../../utils/object-id.util";
import logger from "../../../utils/winston.util";

class AccountVerificationController {
  static async status(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?._id;
    assert(userId !== undefined, "'req.user._id' should not be undefined");

    try {
      const accountVerification = await AccountVerificationUseCase.getByUserId(
        userId!
      );

      if (!accountVerification) {
        const responseBody: TVerificationStatusResponse = {
          status: VERIFICATION_STATUS.NOT_INITIATED,
          accountVerification: null
        };
        res.status(200).json(responseBody);
        return;
      }

      const reviews = accountVerification.reviews || [];

      const hasDeclined = reviews.some(
        (review) => review.status === ACCOUNT_VERIFICATION_STATUS.DECLINED
      );
      if (hasDeclined) {
        const responseBody: TVerificationStatusResponse = {
          status: VERIFICATION_STATUS.DECLINED,
          accountVerification
        };
        res.status(200).json(responseBody);
        return;
      }

      const hasVerified = reviews.some(
        (review) =>
          review.status === ACCOUNT_VERIFICATION_STATUS.NID_VERIFIED ||
          review.status === ACCOUNT_VERIFICATION_STATUS.PASSPORT_VERIFIED
      );

      if (hasVerified) {
        const responseBody: TVerificationStatusResponse = {
          status: VERIFICATION_STATUS.VERIFIED,
          accountVerification
        };
        res.status(200).json(responseBody);
        return;
      }

      const responseBody: TVerificationStatusResponse = {
        status: VERIFICATION_STATUS.PENDING,
        accountVerification
      };
      res.status(200).json(responseBody);
    } catch (err) {
      next(err);
    }
  }

  static async initiate(
    req: Request<
      any,
      any,
      Pick<TAccountVerificationRequestDto, "nidNumber" | "passportNumber">
    >,
    res: Response,
    next: NextFunction
  ) {
    const userId = req.user?._id;
    assert(userId !== undefined, "'req.user._id' should not be undefined");

    try {
      const existingAccountVerification =
        await AccountVerificationUseCase.getByUserId(userId!);

      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const { nidNumber, passportNumber } = req.body;

      const nidFrontImageFile = files?.nidFrontImage?.[0];
      const nidBackImageFile = files?.nidBackImage?.[0];
      const passportImageFile = files?.passportImage?.[0];

      if (!existingAccountVerification) {
        let nidFrontImagePath: string | undefined;
        let nidBackImagePath: string | undefined;
        let passportImagePath: string | undefined;

        const uploadedFiles: string[] = [];

        try {
          if (nidFrontImageFile) {
            const uploadedFile = await FileUploadService.upload(
              nidFrontImageFile,
              "account-verification"
            );
            nidFrontImagePath = uploadedFile.path;
            uploadedFiles.push(nidFrontImagePath);
          }

          if (nidBackImageFile) {
            const uploadedFile = await FileUploadService.upload(
              nidBackImageFile,
              "account-verification"
            );
            nidBackImagePath = uploadedFile.path;
            uploadedFiles.push(nidBackImagePath);
          }

          if (passportImageFile) {
            const uploadedFile = await FileUploadService.upload(
              passportImageFile,
              "account-verification"
            );
            passportImagePath = uploadedFile.path;
            uploadedFiles.push(passportImagePath);
          }

          // create new account verification
          const newAccountVerification =
            await AccountVerificationUseCase.create({
              user: userId!,
              nidNumber,
              nidFrontImage: nidFrontImagePath,
              nidBackImage: nidBackImagePath,
              passportNumber,
              passportImage: passportImagePath
            });

          res.status(201).json(newAccountVerification);

          // Emit notification
          const user = await UserUseCase.getByIdWithProfile(userId!);
          if (user) {
            notificationEventEmitter.emitAccountVerificationReview({
              userId: user._id.toString(),
              name:
                `${user.profile?.firstName || ""} ${user.profile?.lastName || ""}`.trim() ||
                user.email,
              verificationId: newAccountVerification._id.toString()
            });
          }
        } catch (uploadError) {
          // cleanup uploaded files on error
          for (const filePath of uploadedFiles) {
            try {
              await FileUploadService.remove(filePath);
            } catch (cleanupError) {
              logger.error("Failed to cleanup file:", cleanupError);
            }
          }
          throw uploadError;
        }
      } else {
        // update request - could be image or non-image fields
        const previousImages: {
          nidFrontImage?: string;
          nidBackImage?: string;
          passportImage?: string;
        } = {};

        // track previous images for cleanup
        if (nidFrontImageFile && existingAccountVerification.nidFrontImage) {
          previousImages.nidFrontImage =
            existingAccountVerification.nidFrontImage;
        }
        if (nidBackImageFile && existingAccountVerification.nidBackImage) {
          previousImages.nidBackImage =
            existingAccountVerification.nidBackImage;
        }
        if (passportImageFile && existingAccountVerification.passportImage) {
          previousImages.passportImage =
            existingAccountVerification.passportImage;
        }

        const uploadedFiles: string[] = [];

        try {
          const updateData: IUpdateAccountVerificationDto = {};

          // update text fields if provided
          if (nidNumber !== undefined) {
            updateData.nidNumber = nidNumber;
          }
          if (passportNumber !== undefined) {
            updateData.passportNumber = passportNumber;
          }

          // upload new images if provided
          if (nidFrontImageFile) {
            const uploadedFile = await FileUploadService.upload(
              nidFrontImageFile,
              "account-verification"
            );
            updateData.nidFrontImage = uploadedFile.path;
            uploadedFiles.push(uploadedFile.path);
          }

          if (nidBackImageFile) {
            const uploadedFile = await FileUploadService.upload(
              nidBackImageFile,
              "account-verification"
            );
            updateData.nidBackImage = uploadedFile.path;
            uploadedFiles.push(uploadedFile.path);
          }

          if (passportImageFile) {
            const uploadedFile = await FileUploadService.upload(
              passportImageFile,
              "account-verification"
            );
            updateData.passportImage = uploadedFile.path;
            uploadedFiles.push(uploadedFile.path);
          }

          // update account verification and reset reviews to pending
          const updatedAccountVerification =
            await AccountVerificationUseCase.update(userId!, updateData);

          // cleanup previous images after successful update
          for (const [, imagePath] of Object.entries(previousImages)) {
            try {
              await FileUploadService.remove(imagePath);
            } catch (cleanupError) {
              logger.error("Failed to cleanup previous image:", cleanupError);
            }
          }

          res.status(200).json(updatedAccountVerification);

          // Emit notification
          const user = await UserUseCase.getByIdWithProfile(userId!);
          if (user && updatedAccountVerification) {
            notificationEventEmitter.emitAccountVerificationReview({
              userId: user._id.toString(),
              name:
                `${user.profile?.firstName || ""} ${user.profile?.lastName || ""}`.trim() ||
                user.email,
              verificationId: updatedAccountVerification._id.toString()
            });
          }
        } catch (uploadError) {
          // cleanup newly uploaded files on error
          for (const filePath of uploadedFiles) {
            try {
              await FileUploadService.remove(filePath);
            } catch (cleanupError) {
              logger.error("Failed to cleanup file:", cleanupError);
            }
          }
          throw uploadError;
        }
      }
    } catch (err) {
      next(err);
    }
  }

  static async pendingReviews(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const accountVerifications =
        await AccountVerificationUseCase.getPendingVerificationAccounts();
      res.status(200).json(accountVerifications);
    } catch (err) {
      next(err);
    }
  }

  static async acceptRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { nid, passport } = req.query;
      const id = convertToObjectId(req.params.accountVerificationId);

      const statuses: TAccountVerificationStatus[] = [];

      if (nid === "true") {
        statuses.push(ACCOUNT_VERIFICATION_STATUS.NID_VERIFIED);
      }

      if (passport === "true") {
        statuses.push(ACCOUNT_VERIFICATION_STATUS.PASSPORT_VERIFIED);
      }

      const accountVerification = await AccountVerificationUseCase.addReview(
        id!,
        req.user!,
        statuses
      );

      if (!accountVerification) {
        throw new ApiError(404, "Account verification not found");
      }

      notificationEventEmitter.emitAccountVerificationResult({
        userId: accountVerification.user.toString(),
        status: statuses[0] || "REVIEWED"
      });

      res.status(200).json(accountVerification);
    } catch (err) {
      next(err);
    }
  }

  static async declineRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const id = convertToObjectId(req.params.accountVerificationId);

      const accountVerification = await AccountVerificationUseCase.addReview(
        id!,
        req.user!,
        [ACCOUNT_VERIFICATION_STATUS.DECLINED]
      );

      if (!accountVerification) {
        throw new ApiError(404, "Account verification not found");
      }

      notificationEventEmitter.emitAccountVerificationResult({
        userId: accountVerification.user.toString(),
        status: ACCOUNT_VERIFICATION_STATUS.DECLINED
      });

      res.status(200).json(accountVerification);
    } catch (err) {
      next(err);
    }
  }
}

export default AccountVerificationController;
