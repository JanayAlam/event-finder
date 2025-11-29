import { NextFunction, Request, Response } from "express";
import { ApiError } from "next/dist/server/api-utils";
import { getProfileByUserId } from "../../../libs/use-cases/profile.use-case";
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
}

export default UserController;
