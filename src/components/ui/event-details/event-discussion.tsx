import { useAuthStore } from "@/stores/auth-store";
import React from "react";
import { TEventDetail } from "../../../../server/models/event.model";
import { CreatePostCard } from "./discussion/create-post-card";
import { DUMMY_POSTS } from "./discussion/dummy-data";
import { PostCard } from "./discussion/post-card";

interface IEventDiscussionProps {
  event: TEventDetail;
}

export const EventDiscussion: React.FC<IEventDiscussionProps> = ({ event }) => {
  const { user } = useAuthStore();

  const isHost = event.host._id.toString() === user?._id.toString();
  const isMember = event.members.some(
    (m) => m._id.toString() === user?._id.toString()
  );

  const canPost = isHost || isMember;

  return (
    <div className="w-full flex flex-col gap-6 max-w-3xl mx-auto!">
      {canPost && (
        <div className="flex justify-end">
          <CreatePostCard eventId={event._id.toString()} />
        </div>
      )}
      <div className="flex flex-col gap-6">
        {DUMMY_POSTS.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};
