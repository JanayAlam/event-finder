import { z } from "zod";
import { ProductPriceAndSizeCreateDTOSchema } from "./product-price-and-size-schema";

export const ProductDTOSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name should contain at least 3 characters")
      .max(255),
    shortDescription: z.string().max(150).optional(),
    description: z.string().optional(),

    isFeatured: z.boolean().default(false),
    isActive: z.boolean().default(true),
    isNewArrival: z.boolean().default(false),
    isBestSeller: z.boolean().default(false),

    slug: z.string().max(255),
    metaTitle: z.string().max(150).optional(),
    metaDescription: z.string().optional(),

    isRefundable: z.boolean().default(true),

    hasMultipleSizes: z.boolean().default(false),

    basePrice: z.coerce.number().min(0).optional(),
    baseStock: z.coerce.number().min(0).default(0),
    baseSKU: z.string().max(150).optional(),
    baseBarcode: z.string().max(150).optional(),
    basePackagingCost: z.coerce.number().min(0).default(0),

    productBrandId: z.string().max(150).optional(),
    productCategoryId: z.string().max(150),

    productPriceAndSizes: z
      .array(ProductPriceAndSizeCreateDTOSchema)
      .optional(),

    frequentlyBoughtProductIds: z.array(z.string()).optional()
  })
  .strip();

export const ProductCreateDTOSchema = ProductDTOSchema.refine(
  (data) => {
    if (!data.hasMultipleSizes) {
      return data.basePrice !== undefined && data.basePrice !== null;
    }
    return true;
  },
  {
    message:
      "Base price is required when the product does not have multiple sizes",
    path: ["basePrice"]
  }
).refine(
  (data) => {
    if (data.hasMultipleSizes) {
      return data.productPriceAndSizes?.length;
    }
    return true;
  },
  {
    message: "Sizes with price is required when the product has multiple sizes",
    path: ["productPriceAndSizes"]
  }
);

export const ProductCreateParamSchema = z.object({
  outletId: z.string()
});

export const ProductGetAllParamSchema = ProductCreateParamSchema;

export const ProductGetParamSchema = z.object({
  outletId: z.string(),
  productId: z.string()
});

export const ProductUpdateParamSchema = ProductGetParamSchema;

export const ProductDeleteParamSchema = ProductGetParamSchema;

export const ProductStatusUpdateSchema = z
  .object({
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
    isNewArrival: z.boolean().optional(),
    isBestSeller: z.boolean().optional()
  })
  .transform((data) => {
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );
  });

// export const ProductUpdateDTOSchema = ProductDTOSchema.partial();
