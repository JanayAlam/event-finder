import { Types } from "mongoose";
import { z } from "zod";
import { PaginationQuerySchema } from "../../validationSchemas/common";

export type ModelWithObjectId<T> = T & {
  _id: Types.ObjectId;
};

export interface ITimestamps {
  updatedAt: Date;
  createdAt: Date;
}

export type TPaginationQuery = z.infer<typeof PaginationQuerySchema>;

export interface PaginationResponse {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
