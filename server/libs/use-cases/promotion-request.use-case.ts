import { Types } from "mongoose";
import PromotionRequest, {
  TPromotionRequest
} from "../../models/promotion-request.model";
import UserCase from "./base.use-case";

class PromotionRequestUseCase extends UserCase {
  constructor() {
    super();
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
}

export default PromotionRequestUseCase;
