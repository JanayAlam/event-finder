import { SIZE_TYPE, WEIGHT_UNIT } from "@prisma/client";
import { z } from "zod";
import {
  ProductCreateDTOSchema,
  ProductCreateParamSchema,
  ProductDeleteParamSchema,
  ProductDTOSchema,
  ProductGetAllParamSchema,
  ProductGetParamSchema,
  ProductStatusUpdateSchema,
  ProductUpdateParamSchema
} from "../../validationSchemas/product";
import { PaginationResponse } from "../common";

export type TProductDTO = z.infer<typeof ProductDTOSchema>;

export type TProductCreateRequest = z.infer<typeof ProductCreateDTOSchema>;

export type TProductCreateParam = z.infer<typeof ProductCreateParamSchema>;

export type TProductGetAllParam = z.infer<typeof ProductGetAllParamSchema>;

export type TProductGetParam = z.infer<typeof ProductGetParamSchema>;

export type TProductUpdateParam = z.infer<typeof ProductUpdateParamSchema>;

export type TProductDeleteParam = z.infer<typeof ProductDeleteParamSchema>;

export type TProductStatusUpdate = z.infer<typeof ProductStatusUpdateSchema>;

export interface ProductListItem {
  id: string;
  name: string;
  basePhoto?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  hasMultipleSizes: boolean;
  basePrice?: number | null;
  baseStock?: number | null;
  category: {
    id: string | null;
    title: string | null;
  };
  brand: {
    id: string | null;
    name: string | null;
  };
  sizes?: {
    id: string;
    sizeType?: SIZE_TYPE | null;
    sizeName?: string | null;
    weight?: number | null;
    weightUnit?: WEIGHT_UNIT | null;
    price: number;
    stock: number;
  }[];
  priceFrom?: number | null;
  sizesCount?: number | null;
  updatedAt: Date;
  createdAt: Date;
}

export interface ProductListResponse {
  products: ProductListItem[];
  meta: PaginationResponse;
}
