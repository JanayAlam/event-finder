import { QueryOptions } from "mongoose";
import User, { IUserDoc, TUser } from "../../models/user.model";

export async function getUser(
  query: QueryOptions<TUser>
): Promise<IUserDoc | null> {
  return User.findOne(query);
}
