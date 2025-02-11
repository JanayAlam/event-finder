import { User } from "@prisma/client";
import { TUserResponse } from "../../types/auth";

export const serializeUserResponse = (user: User): TUserResponse => {
  const { password: _, ...rest } = user;
  return rest;
};
