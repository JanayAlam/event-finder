import { User } from "@prisma/client";
import { PUBLIC_SERVER_URL } from "../../../settings/config";

export const getUserWithoutPassword = (user: User) => {
  const { password: _, ...rest } = user;
  return rest;
};

export const getResetPasswordLink = (token: string) =>
  `${PUBLIC_SERVER_URL}/reset-password/t/${token}`;
