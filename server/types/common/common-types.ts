import { z } from "zod";
import { PaginationQuerySchema } from "../../validationSchemas/common";

export type TPaginationQuery = z.infer<typeof PaginationQuerySchema>;
