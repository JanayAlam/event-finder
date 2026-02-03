import { NextFunction, Request, Response } from "express";
import { getProfileByUserId } from "../../../libs/use-cases/profile.use-case";
import UserUseCase from "../../../libs/use-cases/user.use-case";
import ApiError from "../../../utils/api-error.util";
import { convertToObjectId } from "../../../utils/object-id.util";

class UserController {
  static async profile(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const profile = await getProfileByUserId(convertToObjectId(id));

      if (!profile) {
        throw new ApiError(404, "Profile not found");
      }

      res.status(200).json(profile);
    } catch (err) {
      next(err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    const { search, page, limit } = req.query;
    try {
      const data = await UserUseCase.listUsersForAdmin({
        search: search as string,
        page: Number(page) || 1,
        limit: Number(limit) || 10
      });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async block(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const userId = convertToObjectId(id);
      if (!userId) throw new ApiError(400, "Invalid user ID");
      await UserUseCase.blockUser(userId);
      res.status(200).json({ message: "User blocked successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async unblock(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const userId = convertToObjectId(id);
      if (!userId) throw new ApiError(400, "Invalid user ID");
      await UserUseCase.unblockUser(userId);
      res.status(200).json({ message: "User unblocked successfully" });
    } catch (err) {
      next(err);
    }
  }
}

export default UserController;
