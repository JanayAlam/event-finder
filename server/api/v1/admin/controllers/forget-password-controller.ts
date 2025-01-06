import { OTP_TYPE, USER_ROLE } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../../../db";
import { sendMail } from "../../../../services/mail";
import { createOTP } from "../../../../services/otp";
import { sendSMS } from "../../../../services/sms";
import { MAIL_SENDER } from "../../../../settings/config";
import { TForgetPasswordRequest } from "../../../../types/admin";

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
      email
    );

    await sendMail({
      to: email,
      subject: "Reset password OTP details",
      from: MAIL_SENDER,
      text: `Your OTP for reset password is ${oTPDetails.otp}`
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

  const oTPDetails = await createOTP(OTP_TYPE.RESET_PASSWORD_PHONE_OTP, phone);

  await sendSMS(
    phone,
    `Your OTP for reset password is ${oTPDetails.otp}`,
    oTPDetails.id.substring(0, 20)
  );

  res.status(204).send();
};
