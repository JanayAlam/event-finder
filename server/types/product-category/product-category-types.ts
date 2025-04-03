import { z } from "zod";
import {
  ProductCategoryCreateDTOParamSchema,
  ProductCategoryCreateDTOSchema,
  ProductCategoryDeleteDTOParamSchema,
  ProductCategoryGetAllDTOParamDTOSchema,
  ProductCategoryGetAllQuerySchema,
  ProductCategoryGetDTOParamSchema,
  ProductCategorySelectListDTOParamSchema,
  ProductCategoryUpdateDTOParamSchema,
  ProductCategoryUpdateDTOSchema
} from "../../validationSchemas/product-category";

export type TProductCategoryCreateRequest = z.infer<
  typeof ProductCategoryCreateDTOSchema
>;

export type TProductCategoryCreateParam = z.infer<
  typeof ProductCategoryCreateDTOParamSchema
>;

export type TProductCategoryUpdateRequest = z.infer<
  typeof ProductCategoryUpdateDTOSchema
>;

export type TProductCategoryGetAllParam = z.infer<
  typeof ProductCategoryGetAllDTOParamDTOSchema
>;

export type TProductCategoryGetParam = z.infer<
  typeof ProductCategoryGetDTOParamSchema
>;

export type TProductCategoryGetAllQuery = z.infer<
  typeof ProductCategoryGetAllQuerySchema
>;

export type TProductCategoryUpdateParam = z.infer<
  typeof ProductCategoryUpdateDTOParamSchema
>;

export type TProductCategoryDeleteParam = z.infer<
  typeof ProductCategoryDeleteDTOParamSchema
>;

export type ProductCategorySelectListParam = z.infer<
  typeof ProductCategorySelectListDTOParamSchema
>;

export interface ProductCategorySelectListItemResponse {
  id: string;
  slug: string;
  title: string;
  updatedAt: Date;
  createdAt: Date;
}
