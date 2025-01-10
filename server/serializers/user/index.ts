import { User } from "@prisma/client";

export const serializeUserResponse = (user: User) => {
  const { password: _, ...rest } = user;
  return rest;
};
