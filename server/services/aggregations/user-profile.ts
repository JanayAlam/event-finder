import mongoose from "mongoose";
import { TUserRole, USER_ROLE } from "../../enums";
import Profile, { TProfile } from "../../models/profile.model";
import User, { TUser } from "../../models/user.model";

type TCreateUserAndProfileDto = {
  kindeId: string;
  email: string;
  role?: TUserRole;
  firstName: string;
  lastName: string;
};

export const createUserAndProfile = async (
  data: TCreateUserAndProfileDto
): Promise<{ user: TUser; profile: TProfile }> => {
  return await mongoose.connection.transaction(async () => {
    const userDoc = await User.create({
      kindeId: data.kindeId,
      email: data.email,
      role: data.role ?? USER_ROLE.TRAVELER
    });

    const profileDoc = await Profile.create({
      user: userDoc._id,
      firstName: data.firstName,
      lastName: data.lastName
    });

    const user: TUser = {
      _id: userDoc._id,
      kindeId: userDoc.kindeId,
      email: userDoc.email,
      role: userDoc.role,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt
    };

    const profile: TProfile = {
      _id: profileDoc._id,
      user: profileDoc.user,
      firstName: profileDoc.firstName,
      lastName: profileDoc.lastName,
      profileImage: profileDoc.profileImage,
      createdAt: profileDoc.createdAt,
      updatedAt: profileDoc.updatedAt
    };

    return { user, profile };
  });
};
