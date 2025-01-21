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

    externalLinkText: z.string().max(50).optional(),
    externalLink: z.string().max(255).optional(),

    isFeatured: z.boolean().default(false),
    isActive: z.boolean().default(true),
    isNewArrival: z.boolean().default(false),
    isBestSeller: z.boolean().default(false),

    youTubeVideoId: z.string().max(150).optional(),

    metaTitle: z.string().max(150).optional(),
    metaDescription: z.string().optional(),

    isRefundable: z.boolean().default(true),

    hasMultipleSizes: z.boolean().default(false),

    basePrice: z.number().min(0).optional(),
    baseStock: z.number().min(0).default(0),
    baseSKU: z.string().max(150).optional(),
    baseBarcode: z.string().max(150).optional(),

    productBrandId: z.string().max(150).optional(),
    productCategoryId: z.string().max(150),

    productPriceAndSizes: z
      .array(ProductPriceAndSizeCreateDTOSchema)
      .optional(),

    frequentlyBoughtProductIds: z.array(z.string()).optional()

    // basePhoto, additionalPhotos
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
    message:
      "Either sizes with price is required when the product has multiple sizes",
    path: ["productPriceAndSizes"]
  }
);

// export const ProductUpdateDTOSchema = ProductDTOSchema.partial();
