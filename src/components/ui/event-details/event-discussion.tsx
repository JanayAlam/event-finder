"use client";

import { Spinner } from "@/components/shared/shadcn-components/spinner";
import { TypographyMuted } from "@/components/shared/shadcn-components/typography";
import { API_BASE_URL } from "@/config";
import DiscussionRepository from "@/repositories/discussion.repository";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { io } from "socket.io-client";
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
    // Determine the socket server URL (strip /api/v1 if present)
    const socketUrl = API_BASE_URL.replace(/\/api\/v1\/?$/, "");
    const socket = io(socketUrl, { withCredentials: true });

    socket.on("connect", () => {
      socket.emit("join-event", event._id.toString());
    });

    socket.on("new-discussion", (newPost) => {
      queryClient.setQueryData(["discussions", event._id], (old: any) => {
        if (!old) return [newPost];
        // Ensure we don't duplicate if the creator's mutation already added it via onMutate
        if (old.some((p: any) => p._id.toString() === newPost._id.toString()))
          return old;
        return [newPost, ...old];
      });
    });

    socket.on("update-discussion", (updatedPost) => {
      queryClient.setQueryData(["discussions", event._id], (old: any) => {
        if (!old) return [updatedPost];
        return old.map((p: any) =>
          p._id.toString() === updatedPost._id.toString() ? updatedPost : p
        );
      });
    });

    socket.on("delete-discussion", (postId) => {
      queryClient.setQueryData(["discussions", event._id], (old: any) => {
        if (!old) return [];
        return old.filter((p: any) => p._id.toString() !== postId.toString());
      });
    });

    return () => {
      socket.emit("leave-event", event._id.toString());
      socket.disconnect();
    };
  }, [event._id, queryClient]);

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
