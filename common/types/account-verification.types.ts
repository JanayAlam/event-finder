import { TAccountVerification } from "../../server/models/account-verification.model";

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
