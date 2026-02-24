import { Spinner } from "@/components/shared/shadcn-components/spinner";
import { TypographyMuted } from "@/components/shared/shadcn-components/typography";
import DiscussionRepository from "@/repositories/discussion.repository";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  TEventDetail,
  TUserWithProfile
} from "../../../../server/models/event.model";
import { CreatePostCard } from "./discussion/create-post-card";
import { PostCard } from "./discussion/post-card";

interface IEventDiscussionProps {
  event: TEventDetail;
}

export const EventDiscussion: React.FC<IEventDiscussionProps> = ({ event }) => {
  const { user } = useAuthStore();

  const isHost = event.host._id.toString() === user?._id.toString();
  const isJoined = event.members.some(
    (m: TUserWithProfile) => m._id.toString() === user?._id.toString()
  );

  const canPost = isHost || isJoined;

  const { data: discussions = [], isLoading } = useQuery({
    queryKey: ["discussions", event._id],
    queryFn: () => DiscussionRepository.getByEvent(event._id.toString())
  });

  return (
    <div className="w-full flex flex-col gap-6 max-w-3xl mx-auto!">
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner className="size-10" />
        </div>
      ) : (
        <>
          {canPost && (
            <div className="flex justify-end">
              <CreatePostCard eventId={event._id.toString()} />
            </div>
          )}
          <div className="flex flex-col gap-6">
            {discussions.map((post) => (
              <PostCard
                key={post._id.toString()}
                post={post}
                eventId={event._id.toString()}
              />
            ))}

            {!discussions.length ? (
              <div className="text-center py-10 bg-secondary/20 rounded-xl border-2 border-dashed">
                <TypographyMuted>
                  No discussions yet. Be the first to start the conversation!
                </TypographyMuted>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};
