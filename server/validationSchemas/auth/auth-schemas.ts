import { z } from "zod";

export const SuperAdminCreateDTOSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string()
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone is required",
    path: ["email", "phone"]
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password did not match",
    path: ["confirmPassword"]
  });

export const OutletAdminCreateDTOSchema = SuperAdminCreateDTOSchema;
