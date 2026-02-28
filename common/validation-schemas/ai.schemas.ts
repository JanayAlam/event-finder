import { z } from "zod";

export const PromtScheam = z.object({
  prompt: z.string().min(1, "Prompt is required")
});
