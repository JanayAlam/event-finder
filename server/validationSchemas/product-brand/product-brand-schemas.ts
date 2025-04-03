import { z } from "zod";

const ProductBrandIdDTOSchema = z
  .object({
    outletId: z.string().trim(),
    productBrandId: z.string().trim()
  })
  .strip();

export const ProductBrandCreateDTOSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    description: z.string().trim().max(500).optional(),
    metaTitle: z.string().trim().max(150).optional(),
    metaDescription: z.string().trim().optional(),
    slug: z.string().trim().max(150)
  })
  .strip();

export const ProductBrandUpdateDTOSchema =
  ProductBrandCreateDTOSchema.partial().strip();

export const ProductBrandCreateDTOParamSchema = z
  .object({
    outletId: z.string().trim()
  })
  .strip();

export const ProductBrandGetAllDTOParamSchema = z.object({
  outletId: z.string().trim()
});

export const ProductBrandGetDTOParamSchema = ProductBrandIdDTOSchema;

export const ProductBrandUpdateDTOParamSchema = ProductBrandIdDTOSchema;

export const ProductBrandDeleteDTOParamSchema = ProductBrandIdDTOSchema;

export const ProductBrandSelectListDTOParamSchema = z
  .object({
    outletId: z.string().trim()
  })
  .strip();
