import { z } from "zod";
import {
  ProductColorDTOSchema,
  ProductCreateDTOSchema,
  ProductDTOSchema,
  ProductPriceDTOSchema,
  ProductSizeDTOSchema
} from "../../validationSchemas/product";

export type TProductSizeDTO = z.infer<typeof ProductSizeDTOSchema>;

export type TProductColorDTO = z.infer<typeof ProductColorDTOSchema>;

export type TProductPriceDTO = z.infer<typeof ProductPriceDTOSchema>;

export type TProductDTO = z.infer<typeof ProductDTOSchema>;

export type TProductCreateRequest = z.infer<typeof ProductCreateDTOSchema>;
