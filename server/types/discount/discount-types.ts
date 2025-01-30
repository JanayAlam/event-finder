import { z } from "zod";
import {
  DiscountCreateParamSchema,
  DiscountCreateSchema,
  DiscountParamSchema
} from "../../validationSchemas/discount";

export type TDiscountCreateRequest = z.infer<typeof DiscountCreateSchema>;

export type TDiscountCreateParam = z.infer<typeof DiscountCreateParamSchema>;

export type TDiscountParam = z.infer<typeof DiscountParamSchema>;
