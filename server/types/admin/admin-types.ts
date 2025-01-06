import { z } from "zod";
import {
  AdminLoginDTOSchema,
  ForgetPasswordDTOSchema,
  ResetPasswordDTOParamSchema,
  ResetPasswordDTOSchema,
  SuperAdminCreateDTOSchema
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
