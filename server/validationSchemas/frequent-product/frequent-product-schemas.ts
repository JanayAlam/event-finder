import { z } from "zod";

export const FrequentProductAddDTOSchema = z.object({
  productIds: z
    .array(z.string())
    .refine(
      (data) => Array.isArray(data) && data.length,
      "Must be an array with at least 1 product id"
    )
});

export const FrequentProductRemoveDTOSchema = FrequentProductAddDTOSchema;

export const FrequentProductAddParamSchema = z.object({
  outletId: z.string(),
  productId: z.string()
});

export const FrequentProductGetAllParamSchema = FrequentProductAddParamSchema;

export const FrequentProductRemoveParamSchema = FrequentProductAddParamSchema;
