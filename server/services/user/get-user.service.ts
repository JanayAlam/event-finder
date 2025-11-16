import { Query, QueryOptions } from "mongoose";
import { IProfileDoc } from "../../models/profile.model";
import User, { IUserDoc, TUser } from "../../models/user.model";

// declearation with profile populated
export function getUser(
  query: QueryOptions<TUser>,
  populate: "profile"
): Query<
  (IUserDoc & { profile: IProfileDoc }) | null,
  IUserDoc & { profile: IProfileDoc }
>;

// declearation without profile populated
export function getUser(
  query: QueryOptions<TUser>
): Query<IUserDoc | null, IUserDoc>;

// implementation of get user
export function getUser(
  query: QueryOptions<TUser>,
  populate?: "profile"
):
  | Query<IUserDoc | null, IUserDoc>
  | Query<
      (IUserDoc & { profile: IProfileDoc }) | null,
      IUserDoc & { profile: IProfileDoc }
    > {
  const user = User.findOne(query);
  return populate ? user.populate(populate) : user;
}
