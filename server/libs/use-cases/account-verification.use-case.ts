import { Types } from "mongoose";
import AccountVerification, {
  TAccountVerification
} from "../../models/account-verification.model";
import UserCase from "./base-use-case";

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
}

export default AccountVerificationUseCase;
