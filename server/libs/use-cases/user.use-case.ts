import { FilterQuery, ProjectionType, QueryOptions, Types } from "mongoose";
import { USER_ROLE } from "../../enums";
import User, { IUserDoc, TUser } from "../../models/user.model";
import UserCase from "./base.use-case";

type TGetAllUserParamDto = {
  filter?: FilterQuery<IUserDoc>;
  projection?: ProjectionType<IUserDoc>;
};

class UserUseCase extends UserCase {
  constructor() {
    super();
  }

  static async getUser(query: QueryOptions<TUser>): Promise<TUser | null> {
    return User.findOne(query).lean<TUser>().exec();
  }

  static async getAllUsers(param: TGetAllUserParamDto): Promise<TUser[]> {
    return User.find({ ...param.filter }, param.projection);
  }

  static async promoteToHost(userId: Types.ObjectId) {
    return User.findOneAndUpdate(
      { _id: userId },
      { role: USER_ROLE.HOST },
      { new: true }
    )
      .select(this.defaultSelect)
      .lean<TUser>()
      .exec();
  }
}

export default UserUseCase;
