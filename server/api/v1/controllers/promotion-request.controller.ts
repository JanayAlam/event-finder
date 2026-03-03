import { NextFunction, Request, Response } from "express";
import { USER_ROLE } from "../../../enums";
import notificationEventEmitter from "../../../events/emitters/notification.event-emitter";
import AccountVerificationUseCase from "../../../libs/use-cases/account-verification.use-case";
import { getProfileByUserId } from "../../../libs/use-cases/profile.use-case";
import PromotionRequestUseCase from "../../../libs/use-cases/promotion-request.use-case";
import UserUseCase from "../../../libs/use-cases/user.use-case";
import ApiError from "../../../utils/api-error.util";
import { convertToObjectId } from "../../../utils/object-id.util";

class PromotionRequestController {
  static async request(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthenticated");
      }

      const existingPromotionRequest =
        await PromotionRequestUseCase.getByUserId(req.user._id);

      if (existingPromotionRequest) {
        throw new ApiError(400, "Already requested");
      }

      const [profile, accountVerification] = await Promise.all([
        getProfileByUserId(req.user._id),
        AccountVerificationUseCase.getByUserId(req.user._id)
      ]);

      if (!profile) {
        throw new ApiError(404, "Profile not found");
      }

      if (!accountVerification) {
        throw new ApiError(400, "Account is not verified");
      }

      const promotionRequest = await PromotionRequestUseCase.create(
        req.user._id
      );

      // Emit notification
      const user = await UserUseCase.getByIdWithProfile(req.user._id);
      if (user) {
        notificationEventEmitter.emitHostRequest({
          userId: req.user._id.toString(),
          name:
            `${user.profile?.firstName || ""} ${user.profile?.lastName || ""}`.trim() ||
            user.email
        });
      }

      res.status(201).json(promotionRequest);
    } catch (err) {
      next(err);
    }
  }

  static async allPendingRequests(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pendingRequests =
        await PromotionRequestUseCase.getAllPendingRequests();
      res.status(200).json(pendingRequests);
    } catch (err) {
      next(err);
    }
  }

  static async acceptPromotionRequest(
    req: Request<{ promotionRequestId: string }, any, any>,
    res: Response,
    next: NextFunction
  ) {
    const { promotionRequestId } = req.params;

    try {
      if (!promotionRequestId) {
        throw new ApiError(400, "Invalid promotion request id");
      }

      const existingPromotionRequest = await PromotionRequestUseCase.getById(
        convertToObjectId(promotionRequestId)!
      );

      if (!existingPromotionRequest) {
        throw new ApiError(404, "Promotion request not found");
      }

      const user = await UserUseCase.promoteToHost(
        existingPromotionRequest.user
      );

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      try {
        const promotionRequest =
          await PromotionRequestUseCase.acceptPromotionRequest(
            existingPromotionRequest._id
          );

        if (!promotionRequest) {
          throw new ApiError(404, "Promotion request not found");
        }

        notificationEventEmitter.emitHostRequestResult({
          userId: promotionRequest.user.toString(),
          isApproved: true
        });

        res.status(200).json(promotionRequest);
      } catch (err) {
        await UserUseCase.update(user._id, { role: USER_ROLE.TRAVELER });
        next(err);
      }
    } catch (err) {
      next(err);
    }
  }

  static async rejectPromotionRequest(
    req: Request<{ promotionRequestId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const { promotionRequestId } = req.params;
    try {
      if (!promotionRequestId) {
        throw new ApiError(400, "Promotion request id not found");
      }

      const pendingRequests =
        await PromotionRequestUseCase.removePromotionRequest(
          convertToObjectId(promotionRequestId)!
        );

      if (pendingRequests) {
        notificationEventEmitter.emitHostRequestResult({
          userId: pendingRequests.user.toString(),
          isApproved: false
        });
      }

      res.status(200).json(pendingRequests);
    } catch (err) {
      next(err);
    }
  }
}

export default PromotionRequestController;
