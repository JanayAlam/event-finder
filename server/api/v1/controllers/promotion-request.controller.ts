import { NextFunction, Request, Response } from "express";
import AccountVerificationUseCase from "../../../libs/use-cases/account-verification.use-case";
import { getProfileByUserId } from "../../../libs/use-cases/profile.use-case";
import PromotionRequestUseCase from "../../../libs/use-cases/promotion-request.use-case";
import ApiError from "../../../utils/api-error.util";

class PromotionRequestController {
  static async request(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthenticated");
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

      res.status(201).json(promotionRequest);
    } catch (err) {
      next(err);
    }
  }
}

export default PromotionRequestController;
