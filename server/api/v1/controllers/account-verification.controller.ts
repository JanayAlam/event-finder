import { NextFunction, Request, Response } from "express";
import {
  TVerificationStatusResponse,
  VerificationStatus
} from "../../../../common/types";
import { ACCOUNT_VERIFICATION_STATUS } from "../../../enums";
import { getAccountVerificationByUserId } from "../../../libs/use-cases/account-verification.use-case";

export const getVerificationStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?._id;

  try {
    const accountVerification = await getAccountVerificationByUserId(userId!);

    if (!accountVerification) {
      const responseBody: TVerificationStatusResponse = {
        status: VerificationStatus.NOT_INITIATED,
        accountVerification: null
      };
      res.status(200).json(responseBody);
      return;
    }

    const reviews = accountVerification.reviews || [];

    const hasDeclined = reviews.some(
      (review) => review.status === ACCOUNT_VERIFICATION_STATUS.DECLINED
    );
    if (hasDeclined) {
      const responseBody: TVerificationStatusResponse = {
        status: VerificationStatus.DECLINED,
        accountVerification
      };
      res.status(200).json(responseBody);
      return;
    }

    const hasVerified = reviews.some(
      (review) =>
        review.status === ACCOUNT_VERIFICATION_STATUS.NID_VERIFIED ||
        review.status === ACCOUNT_VERIFICATION_STATUS.PASSPORT_VERIFIED
    );

    if (hasVerified) {
      const responseBody: TVerificationStatusResponse = {
        status: VerificationStatus.VERIFIED,
        accountVerification
      };
      res.status(200).json(responseBody);
      return;
    }

    const responseBody: TVerificationStatusResponse = {
      status: VerificationStatus.PENDING,
      accountVerification
    };
    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
};

export const initiateAccountVerificationController = async (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
  } catch (err) {
    next(err);
  }
};
