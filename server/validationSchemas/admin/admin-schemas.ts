import { z } from "zod";

export const SuperAdminCreateDTOSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().trim().min(1, "Required").optional(),
    password: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().trim()
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

export const AdminLoginDTOSchema = z
  .object({
    email: z.string().trim().email().optional(),
    phone: z.string().trim().min(1, "Phone number cannot be empty").optional(),
    password: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters long")
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone is required",
    path: ["email", "phone"]
  });

export const ForgetPasswordDTOSchema = z
  .object({
    email: z.string().email().min(1, "Email is required").optional(),
    phone: z.string().trim().min(1, "Phone number cannot be empty").optional()
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone is required",
    path: ["email", "phone"]
  });

export const ResetPasswordDTOSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .trim()
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
    .trim()
    .min(1, "Token is required")
});

export const BlockUserDTOSchema = z.object({
  userId: z
    .string({
      message: "User id is required"
    })
    .trim()
    .min(1, "User id is required")
});

export const UnblockUserDTOSchema = BlockUserDTOSchema;
