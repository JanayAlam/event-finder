import { FilterQuery, Types } from "mongoose";
import Profile, { IProfileDoc, TProfile } from "../../models/profile.model";

export const getProfileByUserId = async (
  userId: Types.ObjectId | undefined
): Promise<TProfile | null> => {
  return Profile.findOne({ user: userId })
    .select("-__v")
    .lean<TProfile>()
    .exec();
};

export const getSingleProfile = async (
  query: FilterQuery<IProfileDoc>
): Promise<TProfile | null> => {
  return Profile.findOne({ ...query })
    .select("-__v")
    .lean<TProfile>()
    .exec();
};
