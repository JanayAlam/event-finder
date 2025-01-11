import { z } from "zod";
import {
  CustomerEmailLoginDTOSchema,
  CustomerEmailVerifyDTOSchema,
  CustomerPhoneLoginDTOSchema,
  CustomerPhoneVerifyDTOSchema
} from "../../validationSchemas/customer";

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
