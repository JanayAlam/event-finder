import { TAccountVerification } from "../../server/models/account-verification.model";
import { TProfile } from "../../server/models/profile.model";
import { TUser } from "../../server/models/user.model";

export type TPendingHostVerificationItem = TUser & {
  profile: TProfile;
  accountVerification: TAccountVerification;
};

export type TAllPendingHostVerificationResponse =
  Array<TPendingHostVerificationItem>;
