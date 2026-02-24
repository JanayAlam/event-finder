import { z } from "zod";

export const CreateDiscussionSchema = z
  .object({
    content: z.string().optional(),
    images: z.array(z.string()).optional()
  })
  .refine((data) => data.content || data.images?.length, {
    message: "Please provide content or images",
    path: ["content", "images"]
  });

export const CreateCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required")
});

export type TCreateDiscussionDto = z.infer<typeof CreateDiscussionSchema>;
export type TCreateCommentDto = z.infer<typeof CreateCommentSchema>;
