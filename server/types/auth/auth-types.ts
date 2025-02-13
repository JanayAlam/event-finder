import { Outlet, User, USER_ROLE } from "@prisma/client";
import { z } from "zod";
import {
  UpdateUserInfoDTOSchema,
  UpdateUserPasswordDTOSchema
} from "../../validationSchemas/auth";

export type TJWTPayload = {
  id: string;
  email?: string | null;
  phone?: string | null;
  role: USER_ROLE;
};

export type TUpdateUserInfoRequest = z.infer<typeof UpdateUserInfoDTOSchema>;

export type TUpdateUserPasswordRequest = z.infer<
  typeof UpdateUserPasswordDTOSchema
>;

export type TUserResponse = Omit<User, "password"> & {
  outlet?: Outlet;
};
