import { Types } from "mongoose";

export const convertToObjectId = (id: string | undefined) =>
  id ? new Types.ObjectId(id) : undefined;
