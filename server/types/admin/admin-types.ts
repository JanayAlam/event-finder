import { z } from "zod";
import {
  AdminLoginDTOSchema,
  ForgetPasswordDTOSchema
} from "../../validationSchemas/admin";

export type TAdminLoginRequest = z.infer<typeof AdminLoginDTOSchema>;

export type TForgetPasswordRequest = z.infer<typeof ForgetPasswordDTOSchema>;
