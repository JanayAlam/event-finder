import { User } from "@prisma/client";

export const getUserWithoutPassword = (user: User) => {
  const { password: _, ...rest } = user;
  return rest;
};
