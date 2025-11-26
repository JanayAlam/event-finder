import { Document, model, Schema, Types } from "mongoose";
import { TUserRole, USER_ROLE, userRoles } from "../enums";
import { ITimestamps, ModelWithObjectId } from "../types/common";

interface UserBase extends ITimestamps {
  kindeId: string;
  email: string;
  role: TUserRole;
  isBlocked?: boolean;
}

export interface IUserDoc extends UserBase, Document {
  _id: Types.ObjectId;
}

const userSchema = new Schema<IUserDoc>(
  {
    kindeId: { type: String, unique: true, required: true, index: true },
    email: { type: String, unique: true, required: true, index: true },
    role: {
      type: String,
      enum: userRoles,
      required: true,
      default: USER_ROLE.TRAVELLER
    },
    isBlocked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const User = model<IUserDoc>("users", userSchema);

export type TUser = ModelWithObjectId<UserBase>;

export default User;
