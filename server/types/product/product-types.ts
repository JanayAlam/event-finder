import { z } from "zod";
import {
  ProductCreateDTOSchema,
  ProductCreateParamSchema,
  ProductDeleteParamSchema,
  ProductDTOSchema,
  ProductGetAllParamSchema,
  ProductGetParamSchema,
  ProductUpdateParamSchema
} from "../../validationSchemas/product";

export type TProductDTO = z.infer<typeof ProductDTOSchema>;

export type TProductCreateRequest = z.infer<typeof ProductCreateDTOSchema>;

export type TProductCreateParam = z.infer<typeof ProductCreateParamSchema>;

export type TProductGetAllParam = z.infer<typeof ProductGetAllParamSchema>;

export type TProductGetParam = z.infer<typeof ProductGetParamSchema>;

export type TProductUpdateParam = z.infer<typeof ProductUpdateParamSchema>;

export type TProductDeleteParam = z.infer<typeof ProductDeleteParamSchema>;
