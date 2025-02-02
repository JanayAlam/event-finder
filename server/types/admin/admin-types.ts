import { User } from "@prisma/client";
import { z } from "zod";
import {
  AdminLoginDTOSchema,
  BlockUserDTOSchema,
  ForgetPasswordDTOSchema,
  ResetPasswordDTOParamSchema,
  ResetPasswordDTOSchema,
  SuperAdminCreateDTOSchema,
  UnblockUserDTOSchema
} from "../../validationSchemas/admin";

export type TSuperAdminCreateRequest = z.infer<
  typeof SuperAdminCreateDTOSchema
>;

export type TAdminLoginRequest = z.infer<typeof AdminLoginDTOSchema>;

export type TForgetPasswordRequest = z.infer<typeof ForgetPasswordDTOSchema>;

export type TResetPasswordPasswordRequest = z.infer<
  typeof ResetPasswordDTOSchema
>;

export type TResetPasswordPasswordParam = z.infer<
  typeof ResetPasswordDTOParamSchema
>;

export type TBlockUserRequest = z.infer<typeof BlockUserDTOSchema>;

export type TUnblockUserRequest = z.infer<typeof UnblockUserDTOSchema>;

export type TAdminLoginResponse = {
  user: Omit<User, "password">;
  accessToken: string;
  refreshToken: string;
};
