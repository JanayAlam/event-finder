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

export const OutletAdminCreateDTOSchema = SuperAdminCreateDTOSchema;

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

export const CustomerEmailVerifyDTOSchema = z.object({
  email: z.string().email()
});

export const CustomerPhoneVerifyDTOSchema = z.object({
  phone: z.string().min(1, "Required")
});

export const CustomerEmailLoginDTOSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(6, "OTP must be 6 characters long")
});

export const CustomerPhoneLoginDTOSchema = z.object({
  phone: z.string().min(1, "Required"),
  otp: z.string().min(6, "OTP must be 6 characters long")
});
