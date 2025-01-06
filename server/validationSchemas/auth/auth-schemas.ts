import { z } from "zod";

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

export const UpdateUserInfoDTOSchema = z.object({
  firstName: z
    .string()
    .min(3, "First name should be at least 3 characters long")
    .optional(),
  lastName: z
    .string()
    .min(3, "Last name should be at least 3 characters long")
    .optional()
});

export const UpdateUserPasswordDTOSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, "Old password must be at least 6 characters long"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters long")
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Confirm password did not match",
    path: ["confirmPassword"]
  });
