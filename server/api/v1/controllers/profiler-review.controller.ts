import { NextFunction, Request, Response } from "express";
import { TIdParam } from "../../../../common/validation-schemas";

class ProfileReviewController {
  static async getAllReviewsOfProfile(
    req: Request<TIdParam, any, any>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      // TODO:
      res.status(200).send(id);
    } catch (err) {
      next(err);
    }
  }
}

export default ProfileReviewController;
