import { z } from "zod";

export const CreateDiscussionSchema = z.object({
  content: z.string().min(1, "Content is required"),
  images: z.array(z.string()).optional()
});

export const CreateCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required")
});

export type TCreateDiscussionDto = z.infer<typeof CreateDiscussionSchema>;
export type TCreateCommentDto = z.infer<typeof CreateCommentSchema>;
