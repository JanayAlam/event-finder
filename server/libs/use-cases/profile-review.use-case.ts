import { Types } from "mongoose";
import {
  TProfileReviewRequest,
  TUpdateProfileReviewRequest
} from "../../../common/validation-schemas";
import ProfileReview, {
  TProfileReview
} from "../../models/profile-review.model";
import Profile from "../../models/profile.model";
import ApiError from "../../utils/api-error.util";
import UserCase from "./base.use-case";

class ProfileReviewUseCase extends UserCase {
  static async createReview(
    reviewerId: Types.ObjectId,
    data: TProfileReviewRequest
  ) {
    const [revieweeProfile, reviewerProfile] = await Promise.all([
      Profile.findById(data.profile),
      Profile.findOne({ user: reviewerId })
    ]);

    if (!revieweeProfile) {
      throw new ApiError(404, "Profile not found");
    }

    if (!reviewerProfile) {
      throw new ApiError(400, "You must have a profile to leave a review");
    }

    if (revieweeProfile.user.toString() === reviewerId.toString()) {
      throw new ApiError(400, "You cannot review your own profile");
    }

    // Check if review already exists
    const existingReview = await ProfileReview.findOne({
      profile: data.profile,
      reviewer: reviewerId
    });

    if (existingReview) {
      throw new ApiError(400, "You have already reviewed this profile");
    }

    const review = await ProfileReview.create({
      ...data,
      reviewer: reviewerId,
      reviewerName: `${reviewerProfile.firstName} ${reviewerProfile.lastName}`
    });

    return review;
  }

  static async updateReview(
    reviewId: Types.ObjectId,
    reviewerId: Types.ObjectId,
    data: TUpdateProfileReviewRequest
  ) {
    const review = await ProfileReview.findById(reviewId);
    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    if (review.reviewer.toString() !== reviewerId.toString()) {
      throw new ApiError(403, "You can only update your own reviews");
    }

    return ProfileReview.findByIdAndUpdate(reviewId, data, { new: true })
      .select(this.defaultSelect)
      .lean<TProfileReview>()
      .exec();
  }

  static async getReviewsOfProfile(profileId: Types.ObjectId) {
    return ProfileReview.find({ profile: profileId })
      .select(this.defaultSelect)
      .sort({ createdAt: -1 })
      .lean<TProfileReview[]>()
      .exec();
  }

  static async getSingleReview(reviewId: Types.ObjectId) {
    return ProfileReview.findById(reviewId)
      .select(this.defaultSelect)
      .lean<TProfileReview>()
      .exec();
  }
}

export default ProfileReviewUseCase;
