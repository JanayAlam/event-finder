import { z } from "zod";
import { AdminLoginDTOSchema } from "../../validationSchemas/admin";

export type TAdminLoginRequest = z.infer<typeof AdminLoginDTOSchema>;
