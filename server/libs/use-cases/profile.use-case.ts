import dayjs from "dayjs";
import { FilterQuery, Types } from "mongoose";
import { z } from "zod";
import { PersonalInfoRequestSchema } from "../../../common/validation-schemas";
import { USER_ROLE } from "../../enums";
import Event from "../../models/event.model";
import ProfileReview from "../../models/profile-review.model";
import Profile, {
  IProfileDoc,
  TProfile,
  TProfileWithUser
} from "../../models/profile.model";

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

export const getProfileWithUser = async (
  query: FilterQuery<IProfileDoc>
): Promise<TProfileWithUser | null> => {
  return Profile.findOne({ ...query })
    .select("-__v")
    .populate({ path: "user" })
    .lean<TProfileWithUser>()
    .exec();
};

export const updatePersonalInfo = (
  id: Types.ObjectId,
  data: z.infer<typeof PersonalInfoRequestSchema>
) => {
  return Profile.findOneAndUpdate({ _id: id }, data, { new: true })
    .select("-__v")
    .lean();
};

export const updateProfileImage = async (
  id: Types.ObjectId,
  profileImagePath: string
): Promise<TProfile | null> => {
  return Profile.findOneAndUpdate(
    { _id: id },
    { profileImage: profileImagePath },
    { new: true }
  )
    .select("-__v")
    .lean();
};

export const removeProfileImage = async (
  id: Types.ObjectId
): Promise<TProfile | null> => {
  return Profile.findOneAndUpdate(
    { _id: id },
    { $unset: { profileImage: "" } },
    { new: true }
  )
    .select("-__v")
    .lean();
};

export const getProfileTripStatus = async (profileId: Types.ObjectId) => {
  const profile = await Profile.findById(profileId).populate("user");
  if (!profile) return null;

  const userId = (profile.user as any)._id;
  const userCreatedAt = (profile.user as any).createdAt;
  const userRole = (profile.user as any).role;

  // 1. Events joined
  const eventsJoined = await Event.countDocuments({ members: userId });

  // 2. Events hosted
  let eventsHosted = null;
  if (userRole === USER_ROLE.HOST) {
    eventsHosted = await Event.countDocuments({ host: userId });
  }

  // 3. Rating
  const reviewStats = await ProfileReview.aggregate([
    { $match: { profile: profileId } },
    { $group: { _id: null, avgRating: { $avg: "$rating" } } }
  ]);
  const rating =
    reviewStats.length > 0
      ? Number(reviewStats[0].avgRating.toFixed(1))
      : "N/A";

  // 4. Member since
  const now = dayjs();
  const joinedDate = dayjs(userCreatedAt);

  const diffInYears = now.diff(joinedDate, "year");
  const diffInMonths = now.diff(joinedDate, "month");
  const diffInDays = now.diff(joinedDate, "day");

  let memberSince = "";
  if (diffInYears >= 1) {
    memberSince = `${diffInYears}yrs.`;
  } else if (diffInMonths >= 1) {
    memberSince = `${diffInMonths}m.`;
  } else {
    memberSince = `${diffInDays}d.`;
  }

  return {
    eventsJoined,
    eventsHosted,
    rating,
    memberSince
  };
};
