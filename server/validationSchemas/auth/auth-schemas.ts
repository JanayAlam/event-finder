import { z } from "zod";

export const UpdateUserInfoDtoSchema = z.object({
  firstName: z
    .string()
    .min(3, "First name should be at least 3 characters long")
    .optional(),
  lastName: z
    .string()
    .min(3, "Last name should be at least 3 characters long")
    .optional()
});

export const UpdateUserPasswordDtoSchema = z
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

export const RefreshAccessTokenDtoSchema = z.object({
  refreshToken: z.string().trim()
});
