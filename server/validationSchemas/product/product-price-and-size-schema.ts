import { SIZE_TYPE, WEIGHT_UNIT } from "@prisma/client";
import { z } from "zod";

export const ProductPriceAndSizeDTOSchema = z
  .object({
    sizeType: z.nativeEnum(SIZE_TYPE),
    sizeName: z.string().max(50).optional(),
    shortDescription: z.string().max(150).optional(),
    weight: z.coerce.number().optional(),
    weightUnit: z.nativeEnum(WEIGHT_UNIT).optional(),
    price: z.coerce.number().min(0),
    packagingCost: z.coerce.number().min(0).optional(),
    SKU: z.string().max(100).optional(),
    barcode: z.string().max(100).optional(),
    stock: z.coerce.number().min(0).default(0),
    lowStockThreshold: z.number().min(0).default(10),
    criticalStockThreshold: z.number().min(0).default(5),
    isFeatured: z.boolean().default(false),
    isActive: z.boolean().default(true)
  })
  .strip();

export const ProductPriceAndSizeCreateDTOSchema =
  ProductPriceAndSizeDTOSchema.refine(
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

export const ProductPriceAndSizeUpdateDTOSchema =
  ProductPriceAndSizeDTOSchema.refine(
    (data) =>
      data.sizeType && data.sizeType === SIZE_TYPE.STANDARD
        ? data.sizeName !== undefined && data.sizeName !== null
        : true,
    {
      message: "Size name is required for `Standard` type",
      path: ["sizeName"]
    }
  )
    .refine(
      (data) =>
        data.sizeType && data.sizeType === SIZE_TYPE.WEIGHT
          ? data.weight !== undefined && data.weight !== null
          : true,
      {
        message: "Weight is required for `Weight` type",
        path: ["weight"]
      }
    )
    .refine(
      (data) =>
        data.sizeType && data.sizeType === SIZE_TYPE.WEIGHT
          ? data.weightUnit !== undefined && data.weightUnit !== null
          : true,
      {
        message: "Weight unit is required for `Weight` type",
        path: ["weightUnit"]
      }
    );
