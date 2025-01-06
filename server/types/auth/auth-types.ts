import { USER_ROLE } from "@prisma/client";
import { z } from "zod";
import {
  CustomerEmailLoginDTOSchema,
  CustomerEmailVerifyDTOSchema,
  CustomerPhoneLoginDTOSchema,
  CustomerPhoneVerifyDTOSchema,
  SuperAdminCreateDTOSchema,
  UpdateUserInfoDTOSchema,
  UpdateUserPasswordDTOSchema
} from "../../validationSchemas/auth";

export type TSuperAdminCreateRequest = z.infer<
  typeof SuperAdminCreateDTOSchema
>;

export type TCustomerEmailVerifyRequest = z.infer<
  typeof CustomerEmailVerifyDTOSchema
>;

export type TCustomerPhoneVerifyRequest = z.infer<
  typeof CustomerPhoneVerifyDTOSchema
>;

export type TCustomerEmailLoginRequest = z.infer<
  typeof CustomerEmailLoginDTOSchema
>;

export type TCustomerPhoneLoginRequest = z.infer<
  typeof CustomerPhoneLoginDTOSchema
>;

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
