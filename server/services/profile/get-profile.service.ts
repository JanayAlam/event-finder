import { Types } from "mongoose";
import Profile, { TProfile } from "../../models/profile.model";

export const getProfileByUserId = async (
  userId: Types.ObjectId | undefined
): Promise<TProfile | null> => {
  return Profile.findOne({ userId }).select("-__v").lean<TProfile>().exec();
};
