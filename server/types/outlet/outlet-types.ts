import { z } from "zod";
import {
  GetOutletDTOParamSchema,
  GetOutletDTOQuerySchema,
  OutletCreateDTOSchema,
  UpdateOutletDTOParamSchema,
  UpdateOutletDTOSchema
} from "../../validationSchemas/outlet";

export type TOutletCreateRequest = z.infer<typeof OutletCreateDTOSchema>;

export type TGetOutletParam = z.infer<typeof GetOutletDTOParamSchema>;

export type TGetOutletQuery = z.infer<typeof GetOutletDTOQuerySchema>;

export type TUpdateOutletRequest = z.infer<typeof UpdateOutletDTOSchema>;

export type TUpdateOutletParam = z.infer<typeof UpdateOutletDTOParamSchema>;
