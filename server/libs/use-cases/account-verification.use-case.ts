import { Types } from "mongoose";
import { TAllPendingAccountVerificationResponse } from "../../../common/types";
import { TAccountVerificationStatus } from "../../enums";
import AccountVerification, {
  IAccountVerificationDoc,
  TAccountVerification
} from "../../models/account-verification.model";
import { TUser } from "../../models/user.model";
import UserCase from "./base.use-case";

export interface ICreateAccountVerificationDto {
  user: Types.ObjectId;
  nidNumber?: string;
  nidFrontImage?: string;
  nidBackImage?: string;
  passportNumber?: string;
  passportImage?: string;
}

export interface IUpdateAccountVerificationDto {
  nidNumber?: string;
  nidFrontImage?: string;
  nidBackImage?: string;
  passportNumber?: string;
  passportImage?: string;
}

class AccountVerificationUseCase extends UserCase {
  constructor() {
    super();
  }

  static getById(
    id: string | Types.ObjectId
  ): Promise<TAccountVerification | null> {
    return AccountVerification.findById(id)
      .select(this.defaultSelect)
      .lean<TAccountVerification>()
      .exec();
  }

  static getByUserId(
    userId: Types.ObjectId
  ): Promise<TAccountVerification | null> {
    return AccountVerification.findOne({
      user: userId
    })
      .select(this.defaultSelect)
      .lean<TAccountVerification>()
      .exec();
  }

  static async create(
    data: ICreateAccountVerificationDto
  ): Promise<IAccountVerificationDoc> {
    const accountVerification = new AccountVerification({
      ...data,
      isReviewed: false
    });

    const saved = await accountVerification.save();
    return saved;
  }

  static async update(
    userId: Types.ObjectId,
    data: IUpdateAccountVerificationDto
  ): Promise<TAccountVerification | null> {
    const updatedAccountVerification =
      await AccountVerification.findOneAndUpdate(
        { user: userId },
        {
          ...data,
          isReviewed: false
        },
        { new: true }
      )
        .select(this.defaultSelect)
        .lean<TAccountVerification>()
        .exec();

    return updatedAccountVerification;
  }

  static async getPendingVerificationAccounts(): Promise<TAllPendingAccountVerificationResponse> {
    const result = await AccountVerification.find({ isReviewed: false })
      .populate({
        path: "user",
        populate: {
          path: "profile"
        }
      })
      .lean<TAllPendingAccountVerificationResponse>()
      .exec();

    return result;
  }

  static async addReview(
    accountVerificationId: Types.ObjectId,
    admin: TUser,
    reviewStatuses: TAccountVerificationStatus[]
  ) {
    const result = await AccountVerification.findOneAndUpdate(
      { _id: accountVerificationId },
      {
        reviews: reviewStatuses.map((status) => ({
          status: status,
          reviewedBy: admin._id,
          reviewedAt: new Date()
        })),
        isReviewed: true
      },
      { new: true }
    );

    return result;
  }
}

export default AccountVerificationUseCase;
