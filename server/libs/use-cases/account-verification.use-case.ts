import { Types } from "mongoose";
import { TAllPendingAccountVerificationResponse } from "../../../common/types";
import AccountVerification, {
  IAccountVerificationDoc,
  TAccountVerification
} from "../../models/account-verification.model";
import UserCase from "./base.use-case";

interface ICreateAccountVerificationDto {
  user: Types.ObjectId;
  nidNumber?: string;
  nidFrontImage?: string;
  nidBackImage?: string;
  passportNumber?: string;
  passportImage?: string;
}

interface IUpdateAccountVerificationDto {
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

    return accountVerification.save();
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
}

export default AccountVerificationUseCase;
