import mongoose from "mongoose";
import { TUserRole, USER_ROLE } from "../../enums/role.enum";
import Profile, { IProfileDoc } from "../../models/profile.model";
import User, { IUserDoc } from "../../models/user.model";

type TCreateUserAndProfileDto = {
  kindeId: string;
  email: string;
  role?: TUserRole;
  firstName: string;
  lastName: string;
};

export const createUserAndProfile = async (
  data: TCreateUserAndProfileDto
): Promise<{ user: IUserDoc; profile: IProfileDoc }> => {
  return await mongoose.connection.transaction(async () => {
    const user = await User.create({
      kindeId: data.kindeId,
      email: data.email,
      role: data.role ?? USER_ROLE.TRAVELLER
    });

    const profile = await Profile.create({
      userId: user._id,
      firstName: data.firstName,
      lastName: data.lastName
    });

    return { user, profile };
  });
};
