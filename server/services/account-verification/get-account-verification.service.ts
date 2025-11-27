import { Types } from "mongoose";
import AccountVerification, {
  TAccountVerification
} from "../../models/account-verification.model";

export const getAccountVerificationByUserId = (
  userId: Types.ObjectId
): Promise<TAccountVerification | null> => {
  return AccountVerification.findOne({
    user: userId
  })
    .select("-__v")
    .lean<TAccountVerification>()
    .exec();
};
