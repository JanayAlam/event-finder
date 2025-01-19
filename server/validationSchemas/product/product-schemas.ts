import { SIZE_TYPE, WEIGHT_UNIT } from "@prisma/client";
import { z } from "zod";

export const ProductSizeDTOSchema = z
  .object({
    sizeId: z.string().max(120), // A dummy id sent from the client
    sizeName: z.string().max(50).optional(),
    shortDescription: z.string().max(150).optional(),
    sizeType: z.nativeEnum(SIZE_TYPE).optional(),
    weight: z.number().optional(),
    weightUnit: z.nativeEnum(WEIGHT_UNIT).optional()
  })
  .refine(
    (data) =>
      data.sizeType === SIZE_TYPE.STANDARD
        ? data.sizeName !== undefined && data.sizeName !== null
        : true,
    {
      message: "Size name is required for `Standard` type",
      path: ["sizeName"]
    }
  )
  .refine(
    (data) =>
      data.sizeType === SIZE_TYPE.WEIGHT
        ? data.weight !== undefined && data.weight !== null
        : true,
    {
      message: "Weight is required for `Weight` type",
      path: ["weight"]
    }
  )
  .refine(
    (data) =>
      data.sizeType === SIZE_TYPE.WEIGHT
        ? data.weightUnit !== undefined && data.weightUnit !== null
        : true,
    {
      message: "Weight unit is required for `Weight` type",
      path: ["weightUnit"]
    }
  );

export const ProductColorDTOSchema = z.object({
  colorId: z.string().max(50), // A dummy id sent from the client
  colorName: z.string().max(50),
  colorHexCode: z
    .string()
    .max(7)
    .refine((data) => data.charAt(0).toString() === "#", {
      message: "Color hex code starts with #"
    }) // #FFFFFF
});

export const ProductPriceDTOSchema = z
  .object({
    productPriceId: z.string().max(50), // A dummy id sent from the client
    price: z.coerce.number().min(0),
    SKU: z.string().max(100).optional(),
    barcode: z.string().max(100).optional(),
    stock: z.coerce.number().min(0).default(0),
    lowStockThreshold: z.number().min(0).default(10),
    criticalStockThreshold: z.number().min(0).default(5),
    colorId: z.string().optional(), // Reference to the color ID
    sizeId: z.string().optional() // Reference to the size ID
  })
  .refine((data) => data.colorId || data.sizeId, {
    message: "Either color or size is required",
    path: ["colorId", "sizeId"]
  });

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
    metaImage: z.string().max(255).optional(),

    isRefundable: z.boolean().default(true),

    hasMultipleVariants: z.boolean().default(false),

    basePrice: z.number().min(0).optional(),
    baseStock: z.number().min(0).default(0),
    baseSKU: z.string().max(150).optional(),
    baseBarcode: z.string().max(150).optional(),

    productBrandId: z.string().max(150).optional(),
    productCategoryId: z.string().max(150).optional(),

    sizes: z.array(ProductSizeDTOSchema).optional(),
    colors: z.array(ProductColorDTOSchema).optional(),
    prices: z.array(ProductPriceDTOSchema).optional(),

    productTags: z.array(z.string()).optional(),

    frequentlyBoughtProductIds: z.array(z.string()).optional()

    // pdfFile, thumbnailPhoto, basePhoto, productPhoto[productPriceId]
  })
  .strip();

export const ProductCreateDTOSchema = ProductDTOSchema.refine(
  (data) => {
    if (!data.hasMultipleVariants) {
      return data.basePrice !== undefined && data.basePrice !== null;
    }
    return true;
  },
  {
    message:
      "Base price is required when the product does not have multiple variants",
    path: ["basePrice"]
  }
)
  .refine(
    (data) => {
      if (data.hasMultipleVariants) {
        return data.sizes?.length || data.colors?.length;
      }
      return true;
    },
    {
      message:
        "Either sizes or colors are required when the product has multiple variants",
      path: ["sizes", "colors"]
    }
  )
  .refine(
    (data) => {
      if (
        data.hasMultipleVariants &&
        (data.sizes?.length || data.colors?.length)
      ) {
        return (
          (data.sizes?.length || 0) * (data.colors?.length || 0) ===
          (data.prices?.length || 0)
        );
      }
      return true;
    },
    {
      message:
        "Number of prices should be equal to the product of sizes and colors",
      path: ["prices"]
    }
  );

// export const ProductUpdateDTOSchema = ProductDTOSchema.partial();
