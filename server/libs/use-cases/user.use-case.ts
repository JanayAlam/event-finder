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

  static async promoteToHost(id: Types.ObjectId) {
    return User.findOneAndUpdate(
      { _id: id },
      { role: USER_ROLE.HOST },
      { new: true }
    )
      .select(this.defaultSelect)
      .lean<TUser>()
      .exec();
  }

  static async update(id: Types.ObjectId, data: Partial<TUser>) {
    return User.findOneAndUpdate({ _id: id }, { ...data }, { new: true })
      .select(this.defaultSelect)
      .lean<TUser>()
      .exec();
  }
}

export default UserUseCase;
