import { ProductCategory } from "@prisma/client";
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

export type ProductCategoryCreateRequest = z.infer<
  typeof ProductCategoryCreateDTOSchema
>;

export type ProductCategoryCreateParam = z.infer<
  typeof ProductCategoryCreateDTOParamSchema
>;

export type ProductCategoryUpdateRequest = z.infer<
  typeof ProductCategoryUpdateDTOSchema
>;

export type ProductCategoryGetAllParam = z.infer<
  typeof ProductCategoryGetAllDTOParamDTOSchema
>;

export type ProductCategoryGetParam = z.infer<
  typeof ProductCategoryGetDTOParamSchema
>;

export type ProductCategoryGetAllQuery = z.infer<
  typeof ProductCategoryGetAllQuerySchema
>;

export type ProductCategoryUpdateParam = z.infer<
  typeof ProductCategoryUpdateDTOParamSchema
>;

export type ProductCategoryDeleteParam = z.infer<
  typeof ProductCategoryDeleteDTOParamSchema
>;

export type ProductCategorySelectListParam = z.infer<
  typeof ProductCategorySelectListDTOParamSchema
>;

export interface GetAllProductCategoryItemResponse extends ProductCategory {
  parentCategory?: {
    id: string;
    title: string;
    slug: string;
  } | null;
  childCategories?: ProductCategory[] | null;
}

export interface ProductCategorySelectListItemResponse {
  id: string;
  slug: string;
  title: string;
  updatedAt: Date;
  createdAt: Date;
}
