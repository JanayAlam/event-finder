import { z } from "zod";

export const PhotoUploadSchema = z.object({
  width: z.number().optional(),
  height: z.number().optional()
});
