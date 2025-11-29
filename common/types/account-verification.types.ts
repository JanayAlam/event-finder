import { TAccountVerification } from "../../server/models/account-verification.model";

export enum VerificationStatus {
  NOT_INITIATED = "not_initiated",
  PENDING = "pending",
  VERIFIED = "verified",
  DECLINED = "declined"
}

export type TVerificationStatusResponse = {
  status: VerificationStatus;
  accountVerification: TAccountVerification | null;
};
