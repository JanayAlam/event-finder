import { z } from "zod";
import { stringRequired } from "./utils";

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export const ProfileReviewSchema = z.object({
  profile: z
    .string()
    .trim()
    .regex(OBJECT_ID_REGEX, { message: "Invalid profile id" }),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be more than 5"),
  message: stringRequired("Message").max(500, "Message is too long")
});

export const UpdateProfileReviewSchema = ProfileReviewSchema.omit({
  profile: true
}).partial();

export type TProfileReviewRequest = z.infer<typeof ProfileReviewSchema>;
export type TUpdateProfileReviewRequest = z.infer<
  typeof UpdateProfileReviewSchema
>;
