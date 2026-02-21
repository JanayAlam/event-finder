import { Document, model, Schema, Types } from "mongoose";
import { ITimestamps, ModelWithObjectId } from "../types/common";
import Event from "./event.model";
import Profile from "./profile.model";

interface IDiscussionComment extends ITimestamps {
  creatorProfile: Types.ObjectId;
  content: string;
}

export interface IDiscussionCommentDoc extends IDiscussionComment, Document {}

const discussionCommentSchema = new Schema<IDiscussionCommentDoc>(
  {
    creatorProfile: {
      type: Schema.Types.ObjectId,
      ref: Profile.collection.name,
      required: true
    },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

interface IDiscussion extends ITimestamps {
  creatorProfile: Types.ObjectId;
  event: Types.ObjectId;
  content: string;
  images: string[];
  upVoters: Types.ObjectId[];
  downVoters: Types.ObjectId[];
  totalVotes: number;
  comments: IDiscussionComment[];
}

export interface IDiscussionDoc extends IDiscussion, Document {}

const discussionSchema = new Schema<IDiscussionDoc>(
  {
    creatorProfile: {
      type: Schema.Types.ObjectId,
      ref: Profile.collection.name,
      required: true
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: Event.collection.name,
      required: true
    },
    content: { type: String, required: true },
    images: { type: [String], default: [] },
    upVoters: {
      type: [Schema.Types.ObjectId],
      ref: Profile.collection.name,
      default: []
    },
    downVoters: {
      type: [Schema.Types.ObjectId],
      ref: Profile.collection.name,
      default: []
    },
    comments: { type: [discussionCommentSchema], default: [] }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

discussionSchema.virtual("totalVotes").get(function (this: IDiscussionDoc) {
  return (this.upVoters?.length || 0) - (this.downVoters?.length || 0);
});

const Discussion = model<IDiscussionDoc>("discussions", discussionSchema);

export type TDiscussion = ModelWithObjectId<IDiscussion>;

export default Discussion;
