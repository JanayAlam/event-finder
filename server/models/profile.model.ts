import { Document, model, Schema, Types } from "mongoose";
import { ITimestamps, ModelWithObjectId } from "../types/common";

interface IProfileBase extends ITimestamps {
  user: Types.ObjectId;
  profileImage?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
}

export interface IProfileDoc extends IProfileBase, Document {
  _id: Types.ObjectId;
}

const profileSchema = new Schema<IProfileDoc>(
  {
    user: {
      type: Schema.ObjectId,
      ref: "users",
      unique: true,
      required: true,
      index: true
    },
    profileImage: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date }
  },
  { timestamps: true }
);

const Profile = model<IProfileDoc>("profiles", profileSchema);

export type TProfile = ModelWithObjectId<IProfileBase>;

export default Profile;
