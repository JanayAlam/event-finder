import { Document, model, Schema } from "mongoose";
import { ITimestamps } from "../types/common";

interface IFacebookToken extends ITimestamps {
  accessToken: string; // This will be the Page Access Token
  userAccessToken?: string; // Optional: User token used to generate the page token
  pageId: string;
  expiresAt?: Date;
}

export interface IFacebookTokenDoc extends IFacebookToken, Document {}

const facebookTokenSchema = new Schema<IFacebookTokenDoc>(
  {
    accessToken: { type: String, required: true },
    userAccessToken: { type: String },
    pageId: { type: String, required: true },
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

const FacebookToken = model<IFacebookTokenDoc>(
  "facebook_tokens",
  facebookTokenSchema
);

export default FacebookToken;
