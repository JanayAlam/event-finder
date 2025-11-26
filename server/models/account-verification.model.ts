import { Document, model, Schema, Types } from "mongoose";
import {
  ACCOUNT_VERIFICATION_STATUS,
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
  review?: IAccountVerificationReview[];
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
      default: ACCOUNT_VERIFICATION_STATUS.PENDING,
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
    review: { type: accountVerificationReviewSchema }
  },
  { timestamps: true }
);

const AccountVerification = model<IAccountVerificationDoc>(
  "account_verifications",
  accountVerificationSchema
);

export type TAccountVerification = ModelWithObjectId<IAccountVerificationBase>;

export default AccountVerification;
