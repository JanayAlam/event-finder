import { TAccountVerification } from "../../server/models/account-verification.model";
import { TProfile } from "../../server/models/profile.model";
import { TUser } from "../../server/models/user.model";

export enum VERIFICATION_STATUS {
  NOT_INITIATED = "not_initiated",
  PENDING = "pending",
  VERIFIED = "verified",
  DECLINED = "declined"
}

export type TVerificationStatusResponse = {
  status: VERIFICATION_STATUS;
  accountVerification: TAccountVerification | null;
};

export type TPendingAccountVerificationItem = Omit<
  TAccountVerification,
  "user"
> & {
  user: TUser & {
    profile: TProfile | null;
  };
};

export type TAllPendingAccountVerificationResponse =
  Array<TPendingAccountVerificationItem>;
