import { z } from "zod";
import {
  UpdateUserInfoDTOSchema,
  UpdateUserPasswordDTOSchema
} from "../../validationSchemas/auth";

export type TJWTPayload = {
  id: string;
  email?: string | null;
  phone?: string | null;
  role: "admin" | "user"; // TODO
};

export type TUpdateUserInfoRequest = z.infer<typeof UpdateUserInfoDTOSchema>;

export type TUpdateUserPasswordRequest = z.infer<
  typeof UpdateUserPasswordDTOSchema
>;

export type TUserResponse = {};
