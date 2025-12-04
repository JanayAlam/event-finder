import { NextFunction, Request, Response } from "express";
import { TPromoteToHostRequest } from "../../../../common/validation-schemas/admin.schemas";
import AccountVerificationUseCase from "../../../libs/use-cases/account-verification.use-case";
import { getProfileByUserId } from "../../../libs/use-cases/profile.use-case";
import UserUseCase from "../../../libs/use-cases/user.use-case";
import ApiError from "../../../utils/api-error.util";

class AdminController {
  static async promoteToHost(
    req: Request<any, any, TPromoteToHostRequest>,
    res: Response,
    next: NextFunction
  ) {
    const { userId } = req.body;

    try {
      if (!userId) {
        throw new ApiError(401, "Invalid user id");
      }

      const [profile, accountVerification] = await Promise.all([
        getProfileByUserId(userId),
        AccountVerificationUseCase.getByUserId(userId)
      ]);

      if (!profile) {
        throw new ApiError(404, "Profile not found");
      }

      if (!accountVerification) {
        throw new ApiError(400, "Account is not verified");
      }

      const newUser = await UserUseCase.promoteToHost(userId);

      if (!newUser) {
        throw new ApiError(404, "User not found");
      }

      res.status(200).json(newUser);
    } catch (err) {
      next(err);
    }
  }
}

export default AdminController;
