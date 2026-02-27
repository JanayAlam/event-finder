import { Types } from "mongoose";
import Discussion, {
  TDiscussionWithProfile
} from "../../models/discussion.model";
import ApiError from "../../utils/api-error.util";

class DiscussionUseCase {
  static async create(data: {
    creatorProfile: Types.ObjectId;
    event: Types.ObjectId;
    content?: string;
    images?: string[];
  }): Promise<TDiscussionWithProfile> {
    const discussion = await Discussion.create(data);
    return Discussion.findById(discussion._id)
      .populate("creatorProfile")
      .populate("comments.creatorProfile")
      .lean<TDiscussionWithProfile>()
      .exec() as Promise<TDiscussionWithProfile>;
  }

  static async getByEventId(
    eventId: Types.ObjectId
  ): Promise<TDiscussionWithProfile[]> {
    return Discussion.find({ event: eventId })
      .populate("creatorProfile")
      .populate("comments.creatorProfile")
      .sort({ createdAt: -1 })
      .lean<TDiscussionWithProfile[]>()
      .exec();
  }

  static async addComment(
    discussionId: Types.ObjectId,
    data: {
      creatorProfile: Types.ObjectId;
      content: string;
    }
  ): Promise<TDiscussionWithProfile | null> {
    return Discussion.findByIdAndUpdate(
      discussionId,
      { $push: { comments: data } },
      { new: true }
    )
      .populate("creatorProfile", "firstName lastName profileImage")
      .populate("comments.creatorProfile", "firstName lastName profileImage")
      .lean<TDiscussionWithProfile>()
      .exec();
  }

  static async toggleUpvote(
    discussionId: Types.ObjectId,
    profileId: Types.ObjectId
  ): Promise<TDiscussionWithProfile | null> {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) throw new ApiError(404, "Discussion not found");

    const hasUpvoted = discussion.upVoters.some((v) => v.equals(profileId));

    if (hasUpvoted) {
      // Remove upvote
      return Discussion.findByIdAndUpdate(
        discussionId,
        { $pull: { upVoters: profileId } },
        { new: true }
      )
        .populate("creatorProfile")
        .populate("comments.creatorProfile")
        .lean<TDiscussionWithProfile>()
        .exec();
    } else {
      // Add upvote and remove downvote if exists
      return Discussion.findByIdAndUpdate(
        discussionId,
        {
          $addToSet: { upVoters: profileId },
          $pull: { downVoters: profileId }
        },
        { new: true }
      )
        .populate("creatorProfile")
        .populate("comments.creatorProfile")
        .lean<TDiscussionWithProfile>()
        .exec();
    }
  }

  static async toggleDownvote(
    discussionId: Types.ObjectId,
    profileId: Types.ObjectId
  ): Promise<TDiscussionWithProfile | null> {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) throw new ApiError(404, "Discussion not found");

    const hasDownvoted = discussion.downVoters.some((v) => v.equals(profileId));

    if (hasDownvoted) {
      // Remove downvote
      return Discussion.findByIdAndUpdate(
        discussionId,
        { $pull: { downVoters: profileId } },
        { new: true }
      )
        .populate("creatorProfile")
        .populate("comments.creatorProfile")
        .lean<TDiscussionWithProfile>()
        .exec();
    } else {
      // Add downvote and remove upvote if exists
      return Discussion.findByIdAndUpdate(
        discussionId,
        {
          $addToSet: { downVoters: profileId },
          $pull: { upVoters: profileId }
        },
        { new: true }
      )
        .populate("creatorProfile")
        .populate("comments.creatorProfile")
        .lean<TDiscussionWithProfile>()
        .exec();
    }
  }

  static async delete(
    discussionId: Types.ObjectId,
    profileId: Types.ObjectId
  ): Promise<void> {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) throw new ApiError(404, "Discussion not found");

    if (!discussion.creatorProfile.equals(profileId)) {
      throw new ApiError(
        403,
        "You are not authorized to delete this discussion"
      );
    }

    await Discussion.findByIdAndDelete(discussionId).exec();
  }
}

export default DiscussionUseCase;
