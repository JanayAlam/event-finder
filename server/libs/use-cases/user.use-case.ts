import { FilterQuery, ProjectionType, QueryOptions } from "mongoose";
import User, { IUserDoc, TUser } from "../../models/user.model";

type TGetAllUserParamDto = {
  filter?: FilterQuery<IUserDoc>;
  projection?: ProjectionType<IUserDoc>;
};

export const getAllUsers = async (
  param: TGetAllUserParamDto
): Promise<TUser[]> => {
  return User.find({ ...param.filter }, param.projection);
};

export const getUser = async (
  query: QueryOptions<TUser>
): Promise<TUser | null> => {
  return User.findOne(query).lean<TUser>().exec();
};
