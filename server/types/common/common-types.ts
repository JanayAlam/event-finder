import { Types } from "mongoose";

export type ModelWithObjectId<T> = T & {
  _id: Types.ObjectId;
};

export interface ITimestamps {
  updatedAt: Date;
  createdAt: Date;
}
