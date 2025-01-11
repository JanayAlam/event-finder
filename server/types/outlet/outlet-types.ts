import { z } from "zod";
import { OutletCreateDTOSchema } from "../../validationSchemas/outlet";

export type TOutletCreateRequest = z.infer<typeof OutletCreateDTOSchema>;
