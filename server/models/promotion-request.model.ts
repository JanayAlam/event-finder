import { Document, model, Schema, Types } from "mongoose";
import { ITimestamps, ModelWithObjectId } from "../types/common";
import User from "./user.model";

interface PromotionRequestBase extends ITimestamps {
  user: Types.ObjectId;
  isApproved: boolean;
  approvedAt?: Date;
}

export interface IPromotionRequestDoc extends PromotionRequestBase, Document {
  _id: Types.ObjectId;
}

const promotionRequestSchema = new Schema<IPromotionRequestDoc>(
  {
    user: {
      type: Schema.ObjectId,
      ref: User,
      unique: true,
      required: true,
      index: true
    },
    isApproved: { type: Boolean, default: false, required: true },
    approvedAt: { type: Date }
  },
  { timestamps: true }
);

const PromotionRequest = model<IPromotionRequestDoc>(
  "promotion_requests",
  promotionRequestSchema
);

export type TPromotionRequest = ModelWithObjectId<PromotionRequestBase>;

export default PromotionRequest;
