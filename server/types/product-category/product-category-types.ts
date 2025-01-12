import { z } from "zod";
import {
  ProductCategoryCreateDTOSchema,
  ProductCategoryDeleteDTOParamSchema,
  ProductCategoryGetAllQuerySchema,
  ProductCategoryGetDTOParamSchema,
  ProductCategoryUpdateDTOParamSchema,
  ProductCategoryUpdateDTOSchema
} from "../../validationSchemas/product-category";

export type TProductCategoryCreateRequest = z.infer<
  typeof ProductCategoryCreateDTOSchema
>;

export type TProductCategoryUpdateRequest = z.infer<
  typeof ProductCategoryUpdateDTOSchema
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
