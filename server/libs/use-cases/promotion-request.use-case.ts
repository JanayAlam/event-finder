import { Types } from "mongoose";
import { TAllPendingHostVerificationResponse } from "../../../common/types";
import PromotionRequest, {
  TPromotionRequest
} from "../../models/promotion-request.model";
import UserCase from "./base.use-case";

class PromotionRequestUseCase extends UserCase {
  constructor() {
    super();
  }

  static async getById(id: Types.ObjectId): Promise<TPromotionRequest | null> {
    return PromotionRequest.findOne({ _id: id })
      .select(this.defaultSelect)
      .lean<TPromotionRequest>()
      .exec();
  }

  static async getByUserId(
    userId: Types.ObjectId
  ): Promise<TPromotionRequest | null> {
    return PromotionRequest.findOne({ user: userId })
      .select(this.defaultSelect)
      .lean<TPromotionRequest>()
      .exec();
  }

  static async getAllPendingRequests(): Promise<TAllPendingHostVerificationResponse> {
    return PromotionRequest.find({ isApproved: false })
      .select(this.defaultSelect)
      .populate({
        path: "user",
        populate: [{ path: "profile" }, { path: "accountVerification" }]
      })
      .lean<TAllPendingHostVerificationResponse>()
      .exec();
  }

  static async create(userId: Types.ObjectId): Promise<TPromotionRequest> {
    const data = await PromotionRequest.create({
      user: userId
    });

    return {
      _id: data._id,
      user: data.user,
      isApproved: data.isApproved,
      approvedAt: data.approvedAt,
      updatedAt: data.updatedAt,
      createdAt: data.createdAt
    };
  }

  static async acceptPromotionRequest(
    id: Types.ObjectId
  ): Promise<TPromotionRequest | null> {
    return PromotionRequest.findOneAndUpdate(
      { _id: id },
      { isApproved: true, approvedAt: new Date() },
      { new: true }
    )
      .select(this.defaultSelect)
      .lean<TPromotionRequest>()
      .exec();
  }

  static async removePromotionRequest(
    id: Types.ObjectId
  ): Promise<TPromotionRequest | null> {
    return PromotionRequest.findOneAndDelete({ _id: id }, { new: true })
      .select(this.defaultSelect)
      .lean<TPromotionRequest>()
      .exec();
  }
}

export default PromotionRequestUseCase;
