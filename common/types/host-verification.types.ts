import { TAccountVerification } from "../../server/models/account-verification.model";
import { TProfile } from "../../server/models/profile.model";
import { TPromotionRequest } from "../../server/models/promotion-request.model";
import { TUser } from "../../server/models/user.model";

export type TPendingHostVerificationItem = Omit<TPromotionRequest, "user"> & {
  user: TUser & {
    profile: TProfile;
    accountVerification: TAccountVerification;
  };
};

export type TAllPendingHostVerificationResponse =
  Array<TPendingHostVerificationItem>;
