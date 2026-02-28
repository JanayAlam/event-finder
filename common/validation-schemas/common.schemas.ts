import { z } from "zod";

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

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

export const IdParamsSchema = z.object({
  id: z
    .string()
    .trim()
    .regex(OBJECT_ID_REGEX, { message: "Not a valid object id" })
});
