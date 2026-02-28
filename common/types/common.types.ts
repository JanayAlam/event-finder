import { z } from "zod";
import { IdParamsSchema } from "../validation-schemas";

export type TIdParam = z.infer<typeof IdParamsSchema>;
