import { QueryOptions } from "mongoose";
import User, { TUser } from "../../models/user.model";

export async function getUser(
  query: QueryOptions<TUser>
): Promise<TUser | null> {
  return User.findOne(query).lean<TUser>().exec();
}
