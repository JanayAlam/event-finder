import { z } from "zod";

const ProductCategoryIdDTOSchema = z.object({
  outletId: z.string().trim(),
  productCategoryId: z.string().trim()
});

export const ProductCategoryCreateDTOSchema = z
  .object({
    title: z.string().trim().min(1).max(100),
    subtitle: z.string().trim().max(150).optional(),
    parentCategoryId: z.string().trim().optional(),
    metaTitle: z.string().trim().max(150).optional(),
    metaDescription: z.string().trim().optional(),
    slug: z.string().trim().max(150),
    categoryType: z.enum(["PHYSICAL", "DIGITAL"]).optional()
  })
  .strip();

export const ProductCategoryCreateDTOParamSchema = z.object({
  outletId: z.string().trim()
});

export const ProductCategoryUpdateDTOSchema =
  ProductCategoryCreateDTOSchema.partial().strip();

export const ProductCategoryGetAllDTOParamDTOSchema = z.object({
  outletId: z.string().trim()
});

export const ProductCategoryGetDTOParamSchema = ProductCategoryIdDTOSchema;

export const ProductCategoryGetAllQuerySchema = z.object({
  shouldIncludeChildProductCategories: z
    .string()
    .trim()
    .optional()
    .refine(
      (data) => data === "true" || data === undefined,
      "shouldIncludeChildProductCategories must be either true or undefined"
    )
});

export const ProductCategoryUpdateDTOParamSchema = ProductCategoryIdDTOSchema;

export const ProductCategoryDeleteDTOParamSchema = ProductCategoryIdDTOSchema;

export const ProductCategorySelectListDTOParamSchema = z.object({
  outletId: z.string().trim()
});
