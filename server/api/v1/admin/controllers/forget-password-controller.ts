import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { Request, Response } from "express";
import { prisma } from "../../../../db";
import { sendMail } from "../../../../services/mail";
import { createResetToken } from "../../../../services/reset-password";
import { sendSMS } from "../../../../services/sms";
import { findAdminUserByEmailOrPhone } from "../../../../services/user";
import { MAIL_SENDER } from "../../../../settings/config";
import { TForgetPasswordRequest } from "../../../../types/admin";
import { getResetPasswordLink } from "../utils";

export const forgetPasswordHandler = async (
  req: Request<any, any, TForgetPasswordRequest, any>,
  res: Response
) => {
  const { email, phone } = req.body;

  if (!email && !phone) {
    res.status(400).json({
      phone: "Either email or phone is required",
      email: "Either email or phone is required"
    });
    return;
  }

  const user = await findAdminUserByEmailOrPhone({ email, phone });

  if (!user) {
    res.status(404).json({
      [email ? "email" : "phone"]:
        `Admin not found with the provided ${email ? "email" : "phone number"}`
    });
    return;
  }

  const resetToken = await createResetToken(user.id);
  const resetLink = getResetPasswordLink(resetToken.token);

  if (email) {
    await sendMail({
      to: email,
      subject: "Reset Password Request",
      from: MAIL_SENDER,
      html: `
          <html lang="en">
            <body>
              <p>Please click on the following link to reset your password</p>
              <a target="_blank" href="${resetLink}">${resetLink}</a>
            </body>
          </html>
        `
    });
  } else {
    await sendSMS(
      phone!,
      `Please click on the following link to reset your password. Link: ${resetLink}`,
      resetToken.id.substring(0, 20)
    );
  }

  res.status(204).send();
};

export const resetPasswordHandler = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    await prisma.$transaction(async (tx) => {
      const resetPasswordToken = await tx.resetPasswordToken.findFirst({
        where: { token }
      });

      if (!resetPasswordToken) {
        throw new Error("Token is invalid");
      }

      if (dayjs(resetPasswordToken.expireAt).diff(dayjs(), "minutes") < 0) {
        await tx.resetPasswordToken.deleteMany({ where: { token } });
        throw new Error("Token is expired");
      }

      await tx.user.update({
        where: { id: resetPasswordToken.userId },
        data: {
          password: hashedPassword,
          ResetPasswordToken: { delete: true }
        }
      });
    });

    res.status(204).send();
  } catch (err) {
    res.status(400).json({ token: (err as Error).message });
  }
};
