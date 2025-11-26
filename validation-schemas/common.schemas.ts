import { isValidObjectId, Types } from "mongoose";
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

export const IdParamsSchema = z.object({
  id: z
    .string()
    .trim()
    .refine((val) => isValidObjectId(val), { message: "Not a valid object id" })
    .transform((val) => new Types.ObjectId(val))
});

export type TIdParam = z.infer<typeof IdParamsSchema>;
