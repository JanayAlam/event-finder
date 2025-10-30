import { TUserRole } from "../../enums/role.enum";
import User from "../../models/User";

export const getUserByKindeId = (kindeId: string) => {
  return User.findOne({ kindeId });
};

type TUpsertUserDto = {
  kindeId: string;
  email: string;
  role?: TUserRole;
};

export const upsertUser = async (requestDto: TUpsertUserDto) => {
  const { kindeId, email, role } = requestDto;
  return User.findOneAndUpdate(
    { kindeId },
    { kindeId, email, role },
    { upsert: true, new: true }
  );
};
