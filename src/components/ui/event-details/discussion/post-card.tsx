"use client";

import Modal from "@/components/shared/organisms/modal/Modal";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/shared/shadcn-components/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/shared/shadcn-components/card";
import { Separator } from "@/components/shared/shadcn-components/separator";
import {
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { getImageUrl } from "@/lib/utils";
import DiscussionRepository from "@/repositories/discussion.repository";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useState } from "react";
import { toast } from "sonner";
import { TDiscussionWithProfile } from "../../../../../server/models/discussion.model";
import { PostActions } from "./post-actions";
import { PostComments } from "./post-comments";

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

  const hasUpvoted = post.upVoters?.some(
    (id) => id.toString() === currentUser?.profile?._id.toString()
  );
  const hasDownvoted = post.downVoters?.some(
    (id) => id.toString() === currentUser?.profile?._id.toString()
  );

  const totalVotes =
    (post.upVoters?.length || 0) - (post.downVoters?.length || 0);

  const voteMutation = useMutation({
    mutationFn: ({ type }: { type: "upvote" | "downvote" }) => {
      return type === "upvote"
        ? DiscussionRepository.toggleUpvote(eventId, post._id.toString())
        : DiscussionRepository.toggleDownvote(eventId, post._id.toString());
    },
    onMutate: async ({ type }) => {
      await queryClient.cancelQueries({ queryKey: ["discussions", eventId] });
      const previousDiscussions = queryClient.getQueryData<
        TDiscussionWithProfile[]
      >(["discussions", eventId]);

      if (previousDiscussions) {
        queryClient.setQueryData<TDiscussionWithProfile[]>(
          ["discussions", eventId],
          (old) => {
            if (!old) return [];
            return old.map((d) => {
              if (d._id.toString() !== post._id.toString()) return d;

              let upVoters = [...(d.upVoters || [])];
              let downVoters = [...(d.downVoters || [])];
              const userId = currentUser?.profile?._id as any;

              if (!userId) return d;

              const isUpvoted = upVoters.some(
                (id) => id.toString() === userId.toString()
              );
              const isDownvoted = downVoters.some(
                (id) => id.toString() === userId.toString()
              );

              if (type === "upvote") {
                if (isUpvoted) {
                  upVoters = upVoters.filter(
                    (id) => id.toString() !== userId.toString()
                  );
                } else {
                  upVoters.push(userId);
                  downVoters = downVoters.filter(
                    (id) => id.toString() !== userId.toString()
                  );
                }
              } else {
                if (isDownvoted) {
                  downVoters = downVoters.filter(
                    (id) => id.toString() !== userId.toString()
                  );
                } else {
                  downVoters.push(userId);
                  upVoters = upVoters.filter(
                    (id) => id.toString() !== userId.toString()
                  );
                }
              }

              return { ...d, upVoters, downVoters };
            });
          }
        );
      }

      return { previousDiscussions };
    },
    onError: (err, variables, context) => {
      if (context?.previousDiscussions) {
        queryClient.setQueryData(
          ["discussions", eventId],
          context.previousDiscussions
        );
      }
      toast.error("Failed to update vote");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions", eventId] });
    }
  });

  const handleUpvote = () => voteMutation.mutate({ type: "upvote" });
  const handleDownvote = () => voteMutation.mutate({ type: "downvote" });

  const toggleComments = () => setIsCommentDialogOpen((prev) => !prev);
  const toggleDelete = () => setIsDeleteDialogOpen((prev) => !prev);

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
          totalVotes={totalVotes}
          commentsCount={post.comments?.length || 0}
          hasUpvoted={!!hasUpvoted}
          hasDownvoted={!!hasDownvoted}
          onUpvote={handleUpvote}
          onDownvote={handleDownvote}
          onCommentClick={toggleComments}
          onDelete={isCreator ? toggleDelete : undefined}
        />
      </CardFooter>

      <PostComments
        isOpen={isCommentDialogOpen}
        onClose={toggleComments}
        post={post}
        eventId={eventId}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteDialogOpen}
        closeHandler={toggleDelete}
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
