import { OTP_TYPE, USER_ROLE } from "@prisma/client";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { Request, Response } from "express";
import { prisma } from "../../../../db";
import { sendMail } from "../../../../services/mail";
import { createOTP, verifyAndRemoveOTP } from "../../../../services/otp";
import { sendSMS } from "../../../../services/sms";
import { MAIL_SENDER, PUBLIC_SERVER_URL } from "../../../../settings/config";
import {
  TForgetPasswordRequest,
  TResetPasswordPasswordParam,
  TResetPasswordPasswordRequest
} from "../../../../types/admin";

export const forgetPasswordHandler = async (
  req: Request<any, any, TForgetPasswordRequest, any>,
  res: Response
) => {
  const { email, phone } = req.body;

  if (email) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email, role: USER_ROLE.SUPER_ADMIN },
          { email, role: USER_ROLE.OUTLET_ADMIN }
        ]
      }
    });

    if (!user) {
      res.status(404).json({
        email: "Admin not found with the provided email"
      });
      return;
    }

    const oTPDetails = await createOTP(
      OTP_TYPE.RESET_PASSWORD_EMAIL_OTP,
      email,
      {
        expireAt: dayjs().add(10, "minute")
      }
    );

    const link = `${PUBLIC_SERVER_URL}/reset-password/u/${user.id}/o/${oTPDetails.otp}/e`;

    await sendMail({
      to: email,
      subject: "Reset Password Request",
      from: MAIL_SENDER,
      html: `
        <html lang="en">
          <body>
            <p>Please click on the following link to reset your password</p>
            <a target="_blank" href="${link}">${link}</a>
          </body>
        </html>
      `
    });

    res.status(204).send();
    return;
  }

  // phone
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { phone, role: USER_ROLE.SUPER_ADMIN },
        { phone, role: USER_ROLE.OUTLET_ADMIN }
      ]
    }
  });

  if (!user) {
    res.status(404).json({
      phone: "Admin not found with the provided phone number"
    });
    return;
  }

  if (!phone) {
    res.status(400).json({
      phone: "Either email or phone is required",
      email: "Either email or phone is required"
    });
    return;
  }

  const oTPDetails = await createOTP(OTP_TYPE.RESET_PASSWORD_PHONE_OTP, phone, {
    expireAt: dayjs().add(10, "minute")
  });

  const link = `${PUBLIC_SERVER_URL}/reset-password/u/${user.id}/o/${oTPDetails.otp}/p`;

  await sendSMS(
    phone,
    `Please click on the following link to reset your password. Link: ${link}`,
    oTPDetails.id.substring(0, 20)
  );

  res.status(204).send();
};

export const resetPasswordHandler = async (
  req: Request<
    TResetPasswordPasswordParam,
    any,
    TResetPasswordPasswordRequest,
    any
  >,
  res: Response
) => {
  const { userId, otp, identifierType } = req.params;
  const { password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: userId, role: USER_ROLE.SUPER_ADMIN },
        { id: userId, role: USER_ROLE.OUTLET_ADMIN }
      ]
    }
  });

  if (!user) {
    res.status(404).json({
      message: "Request is not valid"
    });
    return;
  }

  const otpType =
    identifierType === "e"
      ? OTP_TYPE.RESET_PASSWORD_EMAIL_OTP
      : OTP_TYPE.RESET_PASSWORD_PHONE_OTP;
  const identifier =
    otpType === OTP_TYPE.RESET_PASSWORD_EMAIL_OTP ? user.email : user.phone;

  if (!identifier) {
    res.status(404).json({
      message: "Request is not valid"
    });
    return;
  }

  const isVerified = await verifyAndRemoveOTP(otpType, identifier, otp);

  if (!isVerified) {
    res.status(400).json({
      otp: "OTP is invalid or expired"
    });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      password: hashedPassword
    }
  });

  res.status(204).send();
};
