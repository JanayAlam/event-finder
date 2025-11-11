import { QueryOptions } from "mongoose";
import { TUserRole } from "../../enums/role.enum";
import User, { TUser } from "../../models/user.model";

export const getUserByKindeId = (kindeId: string) => {
  return User.findOne({ kindeId });
};

export const getUser = (query: QueryOptions<TUser>) => {
  return User.findOne(query);
};

type TUpsertUserDto = {
  kindeId: string;
  email: string;
  role?: TUserRole;
};

export const getOrCreateUser = async (requestDto: TUpsertUserDto) => {
  const { kindeId, email, role } = requestDto;
  let user = await User.findOne({ kindeId, email });

  if (!user) {
    user = await User.create({
      kindeId,
      email,
      role
    });
  }

  return user;
};
