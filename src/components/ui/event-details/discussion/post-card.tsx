"use client";

import Modal from "@/components/shared/organisms/modal/Modal";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/shared/shadcn-components/avatar";
import { Button } from "@/components/shared/shadcn-components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/shared/shadcn-components/card";
import { Input } from "@/components/shared/shadcn-components/input";
import { Separator } from "@/components/shared/shadcn-components/separator";
import {
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { getImageUrl } from "@/lib/utils";
import DiscussionRepository from "@/repositories/discussion.repository";
import { useAuthStore } from "@/stores/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Send } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { TDiscussionWithProfile } from "../../../../../server/models/discussion.model";
import { PostActions } from "./post-actions";

dayjs.extend(relativeTime);

interface IPostCardProps {
  eventId: string;
  post: TDiscussionWithProfile;
}

export const PostCard: React.FC<IPostCardProps> = ({ eventId, post }) => {
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();

  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const creatorName = `${post.creatorProfile.firstName} ${post.creatorProfile.lastName}`;
  const creatorInitials = `${post.creatorProfile.firstName?.[0] || ""}${post.creatorProfile.lastName?.[0] || ""}`;

  const isCreator =
    post.creatorProfile._id.toString() === currentUser?.profile?._id.toString();

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const onConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await DiscussionRepository.delete(eventId, post._id.toString());
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["discussions", eventId]
      });
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-none shadow-sm bg-card overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2">
        <Avatar>
          <AvatarImage
            src={getImageUrl(post.creatorProfile.profileImage, {
              name: creatorName
            })}
            alt={creatorName}
          />
          <AvatarFallback>{creatorInitials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <Paragraph className="font-semibold text-sm">{creatorName}</Paragraph>
          <TypographyMuted className="text-xs">
            {dayjs(post.createdAt).fromNow()}
          </TypographyMuted>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex flex-col gap-3">
        <Paragraph className="text-sm leading-relaxed">
          {post.content}
        </Paragraph>
        {post.images?.length ? (
          <div
            className={`grid gap-2 mt-2 rounded-xl overflow-hidden ${
              post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {post.images.map((img: string, idx: number) => (
              <Avatar
                key={idx}
                className="w-full h-auto aspect-video rounded-none"
              >
                <AvatarImage
                  src={getImageUrl(img)}
                  alt={`Post image ${idx + 1}`}
                  className="object-cover aspect-video"
                />
              </Avatar>
            ))}
          </div>
        ) : null}
      </CardContent>
      <Separator className="mx-4 w-auto" />
      <CardFooter className="p-2 px-4">
        <PostActions
          upvotes={post.upVoters?.length || 0}
          _downvotes={post.downVoters?.length || 0}
          commentsCount={post.comments?.length || 0}
          onCommentClick={() => setIsCommentDialogOpen(true)}
          onDelete={isCreator ? handleDelete : undefined}
        />
      </CardFooter>

      {/* Comment Modal */}
      <Modal
        isOpen={isCommentDialogOpen}
        closeHandler={() => setIsCommentDialogOpen(false)}
        title={`Post by ${creatorName}`}
        footer={
          <div className="flex gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={getImageUrl(currentUser?.profile?.profileImage)}
                alt="Me"
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
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-primary"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Original Post */}
          <div className="flex gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={getImageUrl(post.creatorProfile.profileImage)}
                alt={creatorName}
              />
              <AvatarFallback>{creatorInitials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <div className="bg-secondary/30 rounded-2xl p-3">
                <span className="font-bold text-sm block mb-1">
                  {creatorName}
                </span>
                <Paragraph className="text-sm">{post.content}</Paragraph>
              </div>
              <span className="text-[10px] text-muted-foreground px-1">
                {dayjs(post.createdAt).fromNow()}
              </span>
            </div>
          </div>

          <Separator />

          {/* Comments List */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold px-1">Comments</h4>
            {post.comments?.length > 0 ? (
              post.comments.map((comment: any) => {
                const commentCreatorName = `${comment.creatorProfile.firstName} ${comment.creatorProfile.lastName}`;
                const commentCreatorInitials = `${comment.creatorProfile.firstName[0]}${comment.creatorProfile.lastName[0]}`;

                return (
                  <div key={comment._id} className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={getImageUrl(comment.creatorProfile.profileImage)}
                        alt={commentCreatorName}
                      />
                      <AvatarFallback>{commentCreatorInitials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <div className="bg-secondary/50 rounded-2xl p-3">
                        <span className="font-bold text-sm block mb-1">
                          {commentCreatorName}
                        </span>
                        <Paragraph className="text-sm">
                          {comment.content}
                        </Paragraph>
                      </div>
                      <div className="flex items-center gap-3 px-1">
                        <span className="text-[10px] text-muted-foreground">
                          {dayjs(comment.createdAt).fromNow()}
                        </span>
                        <Button
                          variant="link"
                          className="h-auto p-0 text-[10px]"
                        >
                          Like
                        </Button>
                        <Button
                          variant="link"
                          className="h-auto p-0 text-[10px]"
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-center text-muted-foreground py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteDialogOpen}
        closeHandler={() => setIsDeleteDialogOpen(false)}
        title="Delete Post"
        okText="Delete"
        okHandler={onConfirmDelete}
        loading={isDeleting}
      >
        <Paragraph className="text-sm">
          Are you sure you want to delete this post? This action cannot be
          undone.
        </Paragraph>
      </Modal>
    </Card>
  );
};
