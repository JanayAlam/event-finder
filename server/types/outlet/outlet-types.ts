import { z } from "zod";
import {
  GetOutletDTOParamSchema,
  GetOutletDTOQuerySchema,
  OutletCreateDTOSchema
} from "../../validationSchemas/outlet";

export type TOutletCreateRequest = z.infer<typeof OutletCreateDTOSchema>;

export type TGetOutletParam = z.infer<typeof GetOutletDTOParamSchema>;

export type TGetOutletQuery = z.infer<typeof GetOutletDTOQuerySchema>;
