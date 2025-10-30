import { Document, model, Schema } from "mongoose";
import { TUserRole, USER_ROLE, userRoles } from "../enums/role.enum";
import { ITimestamps, ModelWithObjectId } from "../types/common";

interface UserBase extends ITimestamps {
  kindeId: string;
  email: string;
  role: TUserRole;
}

export interface IUserDoc extends UserBase, Document {}

const userSchema = new Schema<IUserDoc>(
  {
    kindeId: { type: String, unique: true, required: true, index: true },
    email: { type: String, unique: true, required: true, index: true },
    role: {
      type: String,
      enum: userRoles,
      required: true,
      default: USER_ROLE.TRAVELLER
    }
  },
  { timestamps: true }
);

const User = model<IUserDoc>("users", userSchema);

export type TUser = ModelWithObjectId<UserBase>;

export default User;
