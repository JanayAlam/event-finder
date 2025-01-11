import { z } from "zod";

export const CustomerEmailVerifyDTOSchema = z.object({
  email: z.string().trim().email()
});

export const CustomerPhoneVerifyDTOSchema = z.object({
  phone: z.string().trim().min(1, "Required")
});

export const CustomerEmailLoginDTOSchema = z.object({
  email: z.string().trim().email(),
  otp: z.string().trim().min(6, "OTP must be 6 characters long")
});

export const CustomerPhoneLoginDTOSchema = z.object({
  phone: z.string().trim().min(1, "Required"),
  otp: z.string().trim().min(6, "OTP must be 6 characters long")
});
