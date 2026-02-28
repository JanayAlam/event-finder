import { NextFunction, Request, Response } from "express";
import { TIdParam } from "../../../../common/types";
import ProfileReviewUseCase from "../../../libs/use-cases/profile-review.use-case";
import { convertToObjectId } from "../../../utils/object-id.util";

class ProfileReviewController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const review = await ProfileReviewUseCase.createReview(user._id, {
        ...req.body,
        profile: convertToObjectId(req.body.profile)!
      });
      res.status(201).json(review);
    } catch (err) {
      next(err);
    }
  }

  static async update(
    req: Request<TIdParam, any, any>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const user = req.user!;
      const review = await ProfileReviewUseCase.updateReview(
        convertToObjectId(id)!,
        user._id,
        req.body
      );
      res.status(200).json(review);
    } catch (err) {
      next(err);
    }
  }

  static async getAllReviewsOfProfile(
    req: Request<TIdParam, any, any>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const reviews = await ProfileReviewUseCase.getReviewsOfProfile(
        convertToObjectId(id)!
      );
      res.status(200).json(reviews);
    } catch (err) {
      next(err);
    }
  }
}

export default ProfileReviewController;
