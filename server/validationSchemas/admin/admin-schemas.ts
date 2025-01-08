import { z } from "zod";

export const SuperAdminCreateDTOSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().min(1, "Required").optional(),
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

export const AdminLoginDTOSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().min(1, "Phone number cannot be empty").optional(),
    password: z.string().min(6, "Password must be at least 6 characters long")
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone is required",
    path: ["email", "phone"]
  });

export const ForgetPasswordDTOSchema = z
  .object({
    email: z.string().email().min(1, "Email is required").optional(),
    phone: z.string().min(1, "Phone number cannot be empty").optional()
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone is required",
    path: ["email", "phone"]
  });

export const ResetPasswordDTOSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters long")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password did not match",
    path: ["confirmPassword"]
  });

export const ResetPasswordDTOParamSchema = z.object({
  token: z
    .string({
      message: "Token is required"
    })
    .min(1, "Token is required")
});
