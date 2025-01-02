import { z } from "zod";
import {
  OutletAdminCreateDTOSchema,
  SuperAdminCreateDTOSchema
} from "../../validationSchemas/auth";

export type TSuperAdminCreateRequest = z.infer<
  typeof SuperAdminCreateDTOSchema
>;
export type TOutletAdminCreateRequest = z.infer<
  typeof OutletAdminCreateDTOSchema
>;

// export type TUserCreateRequest = z.infer<typeof UserCreateDTOSchema>;
