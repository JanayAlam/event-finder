"use client";

import Modal from "@/components/shared/organisms/modal/Modal";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/shared/shadcn-components/avatar";
import { Button } from "@/components/shared/shadcn-components/button";
import { Input } from "@/components/shared/shadcn-components/input";
import { Spinner } from "@/components/shared/shadcn-components/spinner";
import {
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { getImageUrl } from "@/lib/utils";
import DiscussionRepository from "@/repositories/discussion.repository";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Send } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { TDiscussionWithProfile } from "../../../../../server/models/discussion.model";

interface PostCommentsProps {
  post: TDiscussionWithProfile;
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const PostComments: React.FC<PostCommentsProps> = ({
  post,
  eventId,
  isOpen,
  onClose
}) => {
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");

  const currentUserName =
    `${currentUser?.profile?.firstName || ""} ${currentUser?.profile?.lastName || ""}`.trim();

  const creatorName = `${post.creatorProfile.firstName} ${post.creatorProfile.lastName}`;

  const commentMutation = useMutation({
    mutationFn: (commentContent: string) =>
      DiscussionRepository.addComment(eventId, post._id.toString(), {
        content: commentContent
      }),
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["discussions", eventId] });
      toast.success("Comment added");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || commentMutation.isPending) return;
    commentMutation.mutate(content);
  };

  return (
    <Modal
      isOpen={isOpen}
      closeHandler={onClose}
      title={`Comments on ${creatorName}'s post`}
      footer={
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={getImageUrl(currentUser?.profile?.profileImage, {
                name: currentUserName
              })}
              alt={currentUserName}
            />
            <AvatarFallback>
              {currentUser?.profile?.firstName?.[0]}
              {currentUser?.profile?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 relative">
            <Input
              placeholder="Write a comment..."
              className="pr-10 rounded-full"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={commentMutation.isPending}
            />
            <Button
              size="icon"
              variant="ghost"
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
              disabled={!content.trim() || commentMutation.isPending}
            >
              {commentMutation.isPending ? (
                <Spinner className="size-4" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </div>
        </form>
      }
    >
      <div className="flex flex-col gap-4">
        {post.comments?.length ? (
          post.comments.map((comment) => {
            const commentCreatorName = `${comment.creatorProfile.firstName} ${comment.creatorProfile.lastName}`;
            const commentCreatorInitials = `${comment.creatorProfile.firstName?.[0] || ""}${comment.creatorProfile.lastName?.[0] || ""}`;

            return (
              <div key={comment._id.toString()} className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={getImageUrl(comment.creatorProfile.profileImage)}
                    alt={commentCreatorName}
                  />
                  <AvatarFallback>{commentCreatorInitials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <div className="bg-secondary/50 rounded-2xl p-3">
                    <Paragraph className="font-bold text-sm block mb-1">
                      {commentCreatorName}
                    </Paragraph>
                    <Paragraph className="text-sm">{comment.content}</Paragraph>
                  </div>
                  <TypographyMuted className="text-[10px] px-2">
                    {dayjs(comment.createdAt).fromNow()}
                  </TypographyMuted>
                </div>
              </div>
            );
          })
        ) : (
          <TypographyMuted className="text-sm text-center py-4">
            No comments yet. Be the first to comment!
          </TypographyMuted>
        )}
      </div>
    </Modal>
  );
};
