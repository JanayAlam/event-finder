import { TUserRole } from "../../enums/role.enum";
import User from "../../models/user.model";

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
