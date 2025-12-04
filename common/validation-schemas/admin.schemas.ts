import { Types } from "mongoose";
import { z } from "zod";
import { stringRequired } from "./utils";

export const PromoteToHostRequestSchema = z.object({
  userId: stringRequired("User id").transform((val) => new Types.ObjectId(val))
});

export type TPromoteToHostRequest = z.infer<typeof PromoteToHostRequestSchema>;
