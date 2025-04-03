import { z } from "zod";
import {
  ProductBrandCreateDTOParamSchema,
  ProductBrandCreateDTOSchema,
  ProductBrandDeleteDTOParamSchema,
  ProductBrandGetAllDTOParamSchema,
  ProductBrandGetDTOParamSchema,
  ProductBrandSelectListDTOParamSchema,
  ProductBrandUpdateDTOSchema
} from "../../validationSchemas/product-brand";

export type ProductBrandCreateRequest = z.infer<
  typeof ProductBrandCreateDTOSchema
>;

export type ProductBrandCreateParam = z.infer<
  typeof ProductBrandCreateDTOParamSchema
>;

export type ProductBrandUpdateRequest = z.infer<
  typeof ProductBrandUpdateDTOSchema
>;

export type ProductBrandGetAllParam = z.infer<
  typeof ProductBrandGetAllDTOParamSchema
>;

export type ProductBrandGetParam = z.infer<
  typeof ProductBrandGetDTOParamSchema
>;

export type ProductBrandDeleteParam = z.infer<
  typeof ProductBrandDeleteDTOParamSchema
>;

export type ProductBrandSelectListParam = z.infer<
  typeof ProductBrandSelectListDTOParamSchema
>;

export interface ProductBrandSelectListItemResponse {
  id: string;
  slug: string;
  name: string;
  updatedAt: Date;
  createdAt: Date;
}
