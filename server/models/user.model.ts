import { Document, model, Schema, Types } from "mongoose";
import { TUserRole, USER_ROLE, userRoles } from "../enums";
import { ITimestamps, ModelWithObjectId } from "../types/common";
import { TAccountVerification } from "./account-verification.model";
import { TProfile } from "./profile.model";

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
      default: USER_ROLE.TRAVELER
    },
    isBlocked: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual populate for profile (reverse relationship)
userSchema.virtual("profile", {
  ref: "profiles",
  localField: "_id",
  foreignField: "user",
  justOne: true
});

// Virtual populate for account verification (reverse relationship)
userSchema.virtual("accountVerification", {
  ref: "account_verifications",
  localField: "_id",
  foreignField: "user",
  justOne: true
});

const User = model<IUserDoc>("users", userSchema);

export type TUser = ModelWithObjectId<UserBase>;

export type TUserWithProfile = TUser & { profile: TProfile | null };

export type TUserWithProfileAndVerification = TUserWithProfile & {
  accountVerification: TAccountVerification | null;
};

export default User;
