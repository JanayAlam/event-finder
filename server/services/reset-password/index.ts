import dayjs from "dayjs";
import crypto from "node:crypto";
import { prisma } from "../../db";

export const createResetToken = async (userId: string) => {
  const token = crypto.randomBytes(20).toString("hex");
  return prisma.resetPasswordToken.create({
    data: {
      token,
      userId,
      expireAt: dayjs().add(15, "minute").toDate()
    }
  });
};
