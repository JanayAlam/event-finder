import { Types } from "mongoose";
import z from "zod";
import { PersonalInfoRequestSchema } from "../../../validation-schemas";
import Profile from "../../models/profile.model";

export const updatePersonalInfo = (
  id: Types.ObjectId,
  data: z.infer<typeof PersonalInfoRequestSchema>
) => {
  return Profile.findOneAndUpdate({ _id: id }, data, { new: true })
    .select("-__v")
    .lean();
};
