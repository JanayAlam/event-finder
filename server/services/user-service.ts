import { USER_ROLE } from "@prisma/client";
import { prisma } from "../db";

export type TUserCreateObj = {
  email?: string;
  phone?: string;
  password?: string;
  role: USER_ROLE;
};

export const createUser = async (user: TUserCreateObj) => {
  const newUser = await prisma.user.create({
    data: user,
    select: {
      id: true,
      email: true,
      phone: true,
      profilePhoto: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      role: true,
      updatedAt: true,
      createdAt: true
    }
  });

  return newUser;
};
