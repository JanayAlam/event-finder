import { Document, model, Schema, Types } from "mongoose";
import {
  accountVerificationStatuses,
  TAccountVerificationStatus
} from "../enums";
import { ITimestamps, ModelWithObjectId } from "../types/common";
import User from "./user.model";

interface IAccountVerificationReview {
  status: TAccountVerificationStatus;
  reviewedBy: Types.ObjectId;
  reviewedAt: Date;
}

interface IAccountVerificationBase extends ITimestamps {
  user: Types.ObjectId;
  nidNumber?: string;
  nidFrontImage?: string;
  nidBackImage?: string;
  passportNumber?: string;
  passportImage?: string;
  isReviewed: boolean;
  reviews?: IAccountVerificationReview[];
}

export interface IAccountVerificationDoc
  extends IAccountVerificationBase,
    Document {
  _id: Types.ObjectId;
}

const accountVerificationReviewSchema = new Schema<IAccountVerificationReview>(
  {
    status: {
      type: String,
      enum: accountVerificationStatuses,
      required: true
    },
    reviewedBy: { type: Schema.ObjectId, ref: User, required: true },
    reviewedAt: { type: Date, default: new Date(), required: true }
  },
  { _id: false }
);

const accountVerificationSchema = new Schema<IAccountVerificationDoc>(
  {
    user: {
      type: Schema.ObjectId,
      ref: User,
      unique: true,
      required: true,
      index: true
    },
    nidNumber: { type: String },
    nidFrontImage: { type: String },
    nidBackImage: { type: String },
    passportNumber: { type: String },
    passportImage: { type: String },
    isReviewed: { type: Boolean, default: false, required: true },
    reviews: { type: [accountVerificationReviewSchema] }
  },
  { timestamps: true }
);

const AccountVerification = model<IAccountVerificationDoc>(
  "account_verifications",
  accountVerificationSchema
);

export type TAccountVerification = ModelWithObjectId<IAccountVerificationBase>;

export default AccountVerification;
