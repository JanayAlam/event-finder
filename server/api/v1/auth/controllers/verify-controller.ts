import { OTP_TYPE, USER_ROLE } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../../../db";
import { sendMail } from "../../../../services/mail";
import { createOTP } from "../../../../services/otp";
import { sendSMS } from "../../../../services/sms";
import {
  TCustomerEmailVerifyRequest,
  TCustomerPhoneVerifyRequest
} from "../../../../types/auth";

export const verifyCustomerEmailAndSendOTP = async (
  req: Request<any, any, TCustomerEmailVerifyRequest, any>,
  res: Response
) => {
  const { email } = req.body;

  let user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email
      }
    });
  }

  if (user?.isUserBlocked) {
    res.status(403).json({
      message: "User has been blocked"
    });
    return;
  }

  if (user?.role !== USER_ROLE.CUSTOMER) {
    res.status(403).json({
      message: "OTP login is only valid for customers"
    });
    return;
  }

  const oTPDetails = await createOTP(OTP_TYPE.LOGIN_EMAIL_OTP, email);

  const isEmailSent = await sendMail({
    to: email,
    subject: "Login OTP",
    text: `Your OTP for login is ${oTPDetails.otp}`
  });

  if (!isEmailSent) {
    res.status(500).json({
      message: "Could not sent the OTP"
    });
    return;
  }

  res.status(204).send();
};

export const verifyCustomerPhoneAndSendOTP = async (
  req: Request<any, any, TCustomerPhoneVerifyRequest, any>,
  res: Response
) => {
  const { phone } = req.body;

  let user = await prisma.user.findUnique({
    where: {
      phone
    }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        phone
      }
    });
  }

  if (user?.isUserBlocked) {
    res.status(403).json({
      message: "User has been blocked"
    });
    return;
  }

  if (user?.role !== USER_ROLE.CUSTOMER) {
    res.status(403).json({
      message: "OTP login is only valid for customers"
    });
    return;
  }

  const oTPDetails = await createOTP(OTP_TYPE.LOGIN_PHONE_OTP, phone);

  const isSMSSent = await sendSMS(
    phone,
    `Your OTP for login is ${oTPDetails.otp}`,
    oTPDetails.id.substring(0, 20)
  );

  if (!isSMSSent) {
    res.status(500).json({
      message: "Could not sent the OTP"
    });
    return;
  }

  res.status(204).send();
};
