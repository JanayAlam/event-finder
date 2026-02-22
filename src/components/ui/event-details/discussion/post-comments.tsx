"use client";

import Modal from "@/components/shared/organisms/modal/Modal";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/shared/shadcn-components/avatar";
import { Button } from "@/components/shared/shadcn-components/button";
import { Input } from "@/components/shared/shadcn-components/input";
import {
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { getImageUrl } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { Send } from "lucide-react";
import React from "react";
import { TDiscussionWithProfile } from "../../../../../server/models/discussion.model";

interface PostCommentsProps {
  post: TDiscussionWithProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const PostComments: React.FC<PostCommentsProps> = ({
  post,
  isOpen,
  onClose
}) => {
  const { user: currentUser } = useAuthStore();
  const currentUserName =
    `${currentUser?.profile?.firstName || ""} ${currentUser?.profile?.lastName || ""}`.trim();

  const creatorName = `${post.creatorProfile.firstName} ${post.creatorProfile.lastName}`;

  return (
    <Modal
      isOpen={isOpen}
      closeHandler={onClose}
      title={`Comments on ${creatorName}'s post`}
      footer={
        <div className="flex gap-2">
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
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
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
