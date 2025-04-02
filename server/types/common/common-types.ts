import { z } from "zod";
import { PaginationQuerySchema } from "../../validationSchemas/common";

export type TPaginationQuery = z.infer<typeof PaginationQuerySchema>;

export interface PaginationResponse {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
