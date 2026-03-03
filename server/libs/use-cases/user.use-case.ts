import { FilterQuery, QueryOptions, Types } from "mongoose";
import { USER_ROLE } from "../../enums";
import Profile from "../../models/profile.model";
import User, {
  IUserDoc,
  TUser,
  TUserWithProfile,
  TUserWithProfileAndVerification
} from "../../models/user.model";
import ApiError from "../../utils/api-error.util";
import UserCase from "./base.use-case";

class UserUseCase extends UserCase {
  constructor() {
    super();
  }

  static async getUser(query: QueryOptions<IUserDoc>) {
    return User.findOne(query).lean<TUser>().exec();
  }

  static async getByIdWithProfile(
    id: Types.ObjectId | string
  ): Promise<TUserWithProfile | null> {
    return User.findById(id)
      .populate("profile")
      .lean<TUserWithProfile>()
      .exec();
  }

  static async getAllUsers(param: {
    filter?: FilterQuery<IUserDoc>;
    projection?: any;
  }): Promise<TUser[]> {
    return User.find({ ...param.filter }, param.projection)
      .lean<TUser[]>()
      .exec();
  }

  static async listUsersForAdmin(param: {
    search?: string;
    page: number;
    limit: number;
  }) {
    const { search, page, limit } = param;
    const skip = (page - 1) * limit;

    const query: FilterQuery<IUserDoc> = {};

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };

      // Find matching profiles first to search by name
      const matchingProfiles = await Profile.find({
        $or: [{ firstName: searchRegex }, { lastName: searchRegex }]
      })
        .select("user")
        .lean()
        .exec();

      const userIdsFromProfiles = matchingProfiles.map((p) => p.user);

      query.$or = [
        { email: searchRegex },
        { _id: { $in: userIdsFromProfiles } }
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .populate("profile")
        .populate({ path: "accountVerification" })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean<TUserWithProfileAndVerification[]>()
        .exec(),
      User.countDocuments(query)
    ]);

    return { users, total, page, limit };
  }

  static async blockUser(id: Types.ObjectId) {
    const user = await User.findById(id);
    if (user?.role === USER_ROLE.ADMIN) {
      throw new ApiError(400, "Cannot block an admin user");
    }

    return User.findOneAndUpdate(
      { _id: id },
      { isBlocked: true },
      { new: true }
    )
      .lean<TUser>()
      .exec();
  }

  static async unblockUser(id: Types.ObjectId) {
    return User.findOneAndUpdate(
      { _id: id },
      { isBlocked: false },
      { new: true }
    )
      .lean<TUser>()
      .exec();
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
