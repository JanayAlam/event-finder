import { model, Schema, Types } from "mongoose";
import { ITimestamps, ModelWithObjectId } from "../types/common";
import { TUser } from "./user.model";

interface IProfileReviewBase extends ITimestamps {
  profile: Types.ObjectId;
  reviewer: Types.ObjectId;
  reviewerName: string;
  rating: number;
  message: string;
}

export interface IProfileReviewDoc extends IProfileReviewBase, Document {
  _id: Types.ObjectId;
}

const profileReviewSchema = new Schema<IProfileReviewDoc>(
  {
    profile: {
      type: Schema.ObjectId,
      ref: "profile",
      required: true,
      index: true
    },
    reviewer: {
      type: Schema.ObjectId,
      ref: "users",
      required: true,
      index: true
    },
    reviewerName: { type: String, required: true },
    rating: { type: Number, required: true },
    message: { type: String, required: true }
  },
  { timestamps: true }
);

const ProfileReview = model<IProfileReviewDoc>(
  "profile_reviews",
  profileReviewSchema
);

export type TProfileReview = ModelWithObjectId<IProfileReviewBase>;

export type TProfileReviewWithReviewer = TProfileReview & { reviewer: TUser };

export default ProfileReview;
