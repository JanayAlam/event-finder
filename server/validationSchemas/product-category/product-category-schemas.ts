import { z } from "zod";

const ProductCategoryIdDTOSchema = z.object({
  outletId: z.string().trim(),
  productCategoryId: z.string().trim()
});

export const ProductCategoryCreateDTOSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(100, "Title must be 100 characters or less"),
    subtitle: z
      .string()
      .trim()
      .max(150, "Subtitle must be 150 characters or less")
      .optional(),
    parentCategoryId: z.string().trim().optional(),
    metaTitle: z
      .string()
      .trim()
      .max(150, "Meta title must be 150 characters or less")
      .optional(),
    metaDescription: z.string().trim().optional(),
    slug: z
      .string()
      .trim()
      .min(1, "Slug is required")
      .max(150, "Slug must be 150 characters or less")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be lowercase and can only contain alphanumeric characters and hyphens"
      ),
    categoryType: z.enum(["PHYSICAL", "DIGITAL"]).optional()
  })
  .strip();

export const ProductCategoryCreateDTOParamSchema = z
  .object({
    outletId: z.string().trim()
  })
  .strip();

export const ProductCategoryUpdateDTOSchema =
  ProductCategoryCreateDTOSchema.partial().strip();

export const ProductCategoryGetAllDTOParamDTOSchema = z
  .object({
    outletId: z.string().trim()
  })
  .strip();

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

export const ProductCategorySelectListDTOParamSchema = z
  .object({
    outletId: z.string().trim()
  })
  .strip();
