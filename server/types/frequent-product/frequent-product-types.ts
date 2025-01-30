import { z } from "zod";
import {
  FrequentProductAddDTOSchema,
  FrequentProductAddParamSchema,
  FrequentProductGetAllParamSchema,
  FrequentProductRemoveDTOSchema,
  FrequentProductRemoveParamSchema
} from "../../validationSchemas/frequent-product";

export type TFrequentProductAddRequest = z.infer<
  typeof FrequentProductAddDTOSchema
>;

export type TFrequentProductRemoveRequest = z.infer<
  typeof FrequentProductRemoveDTOSchema
>;

export type TFrequentProductAddParam = z.infer<
  typeof FrequentProductAddParamSchema
>;

export type TFrequentProductGetAllParam = z.infer<
  typeof FrequentProductGetAllParamSchema
>;

export type TFrequentProductRemoveParam = z.infer<
  typeof FrequentProductRemoveParamSchema
>;
