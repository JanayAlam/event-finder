"use client";

import { EmptyList } from "@/components/shared/molecules/empty";
import { PageLoader } from "@/components/shared/molecules/page-loader";
import { EmptyContent } from "@/components/shared/shadcn-components/empty";
import { PUBLIC_SERVER_URL } from "@/config";
import DiscussionRepository from "@/repositories/discussion.repository";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { TDiscussionWithProfile } from "../../../../server/models/discussion.model";
import { TEventDetail } from "../../../../server/models/event.model";
import { TUserWithProfile } from "../../../../server/models/user.model";
import { CreatePostCard } from "./discussion/create-post-card";
import { PostCard } from "./discussion/post-card";

interface IEventDiscussionProps {
  event: TEventDetail;
}

export const EventDiscussion: React.FC<IEventDiscussionProps> = ({ event }) => {
  const queryClient = useQueryClient();

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

  useEffect(() => {
    const socket = io(PUBLIC_SERVER_URL, { withCredentials: true });

    socket.on("connect", () => {
      socket.emit("join-event", event._id.toString());
    });

    socket.on("new-discussion", (newPost: TDiscussionWithProfile) => {
      queryClient.setQueryData(
        ["discussions", event._id],
        (old: TDiscussionWithProfile[]) => {
          if (!old) {
            return [newPost];
          }

          // Ensure we don't duplicate if the creator's mutation already added it via onMutate
          if (old.some((p) => p._id.toString() === newPost._id.toString())) {
            return old;
          }

          return [newPost, ...old];
        }
      );
    });

    socket.on(
      "update-discussion",
      (updatedPost: TDiscussionWithProfile | null) => {
        queryClient.setQueryData(
          ["discussions", event._id],
          (old: TDiscussionWithProfile[]) => {
            if (!old) {
              return [updatedPost];
            }

            return old.map((p) =>
              p._id.toString() === updatedPost?._id.toString() ? updatedPost : p
            );
          }
        );
      }
    );

    socket.on("delete-discussion", (postId: string) => {
      queryClient.setQueryData(
        ["discussions", event._id],
        (old: TDiscussionWithProfile[]) => {
          if (!old) {
            return [];
          }

          return old.filter((p) => p._id.toString() !== postId.toString());
        }
      );
    });

    return () => {
      socket.emit("leave-event", event._id.toString());
      socket.disconnect();
    };
  }, [event._id, queryClient]);

  return (
    <div className="w-full flex flex-col gap-6 max-w-3xl mx-auto!">
      {isLoading ? (
        <PageLoader />
      ) : (
        <>
          {canPost && discussions.length ? (
            <div className="flex justify-end">
              <CreatePostCard eventId={event._id.toString()} />
            </div>
          ) : null}

          <div className="flex flex-col gap-6">
            {discussions.map((post) => (
              <PostCard
                key={post._id.toString()}
                post={post}
                eventId={event._id.toString()}
              />
            ))}

            {!discussions.length ? (
              <EmptyList
                message="No discussions yet. Be the first to start the conversation!"
                content={
                  <EmptyContent>
                    <CreatePostCard eventId={event._id.toString()} />
                  </EmptyContent>
                }
              />
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};
