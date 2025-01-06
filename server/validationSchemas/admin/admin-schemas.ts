import { z } from "zod";

export const AdminLoginDTOSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().min(1, "Required").optional(),
    password: z.string().min(6, "Password must be at least 6 characters long")
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone is required",
    path: ["email", "phone"]
  });
