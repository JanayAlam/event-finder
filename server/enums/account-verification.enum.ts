export const ACCOUNT_VERIFICATION_STATUS = {
  NID_VERIFIED: "nid_verified",
  PASSPORT_VERIFIED: "passport_verified",
  DECLINED: "declined"
} as const;

export const accountVerificationStatuses = Object.values(
  ACCOUNT_VERIFICATION_STATUS
);

export type TAccountVerificationStatus =
  (typeof ACCOUNT_VERIFICATION_STATUS)[keyof typeof ACCOUNT_VERIFICATION_STATUS];
