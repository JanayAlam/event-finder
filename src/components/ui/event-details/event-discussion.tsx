import React from "react";
import { CreatePostCard } from "./discussion/create-post-card";
import { DUMMY_POSTS } from "./discussion/dummy-data";
import { PostCard } from "./discussion/post-card";

export const EventDiscussion: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto py-2">
      <CreatePostCard />
      <div className="flex flex-col gap-6">
        {DUMMY_POSTS.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};
