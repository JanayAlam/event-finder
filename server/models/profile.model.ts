import { Document, model, Schema, Types } from "mongoose";
import { ITimestamps, ModelWithObjectId } from "../types/common";
import User from "./user.model";

interface IProfileBase extends ITimestamps {
  userId: Types.ObjectId;
  firstName: string;
  lastName: string;
}

export interface IProfileDoc extends IProfileBase, Document {}

const profileSchema = new Schema<IProfileDoc>(
  {
    userId: {
      type: Schema.ObjectId,
      ref: User,
      unique: true,
      required: true,
      index: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Profile = model<IProfileDoc>("profiles", profileSchema);

export type TProfile = ModelWithObjectId<IProfileBase>;

export default Profile;
