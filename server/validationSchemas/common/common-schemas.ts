import { z } from "zod";

export const PaginationQuerySchema = z.object({
  pageSize: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Must be a valid number")
    .transform((val) => Number(val))
    .optional(),
  page: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Must be a valid number")
    .transform((val) => Number(val))
    .optional()
});
