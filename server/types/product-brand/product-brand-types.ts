import { z } from "zod";
import {
  ProductBrandCreateDTOSchema,
  ProductBrandDeleteDTOParamSchema,
  ProductBrandGetDTOParamSchema,
  ProductBrandUpdateDTOSchema
} from "../../validationSchemas/product-brand";

export type TProductBrandCreateRequest = z.infer<
  typeof ProductBrandCreateDTOSchema
>;

export type TProductBrandUpdateRequest = z.infer<
  typeof ProductBrandUpdateDTOSchema
>;

export type TProductBrandGetParam = z.infer<
  typeof ProductBrandGetDTOParamSchema
>;

export type TProductBrandDeleteParam = z.infer<
  typeof ProductBrandDeleteDTOParamSchema
>;
