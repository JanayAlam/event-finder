import { USER_ROLE } from "@prisma/client";
import { z } from "zod";
import {
  AdminLoginDTOSchema,
  CustomerEmailLoginDTOSchema,
  CustomerEmailVerifyDTOSchema,
  CustomerPhoneLoginDTOSchema,
  CustomerPhoneVerifyDTOSchema,
  OutletAdminCreateDTOSchema,
  SuperAdminCreateDTOSchema,
  UpdateUserInfoDTOSchema,
  UpdateUserPasswordDTOSchema
} from "../../validationSchemas/auth";

export type TSuperAdminCreateRequest = z.infer<
  typeof SuperAdminCreateDTOSchema
>;
export type TOutletAdminCreateRequest = z.infer<
  typeof OutletAdminCreateDTOSchema
>;

export type TAdminLoginRequest = z.infer<typeof AdminLoginDTOSchema>;

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
