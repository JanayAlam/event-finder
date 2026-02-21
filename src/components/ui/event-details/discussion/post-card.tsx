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
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import { Send } from "lucide-react";
import React, { useState } from "react";
import { TDiscussionPost } from "./discussion.types";
import { PostActions } from "./post-actions";

interface PostCardProps {
  post: TDiscussionPost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);

  return (
    <Card className="border-none shadow-sm bg-card overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2">
        <Avatar>
          <AvatarImage src={post.user.avatar} alt={post.user.name} />
          <AvatarFallback>{post.user.initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{post.user.name}</span>
          <span className="text-xs text-muted-foreground">
            {post.createdAt}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex flex-col gap-3">
        <Paragraph className="text-sm leading-relaxed">
          {post.content}
        </Paragraph>
        {post.images.length ? (
          <div
            className={`grid gap-2 mt-2 rounded-xl overflow-hidden ${
              post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {post.images.map((img, idx) => (
              <Avatar
                key={idx}
                className="w-full h-auto aspect-video rounded-none"
              >
                <AvatarImage
                  src={img}
                  alt={`Post image ${idx + 1}`}
                  className="object-cover aspect-video hover:scale-105 transition-transform duration-300"
                />
              </Avatar>
            ))}
          </div>
        ) : null}
      </CardContent>
      <Separator className="mx-4 w-auto" />
      <CardFooter className="p-2 px-4">
        <PostActions
          upvotes={post.upvotes}
          _downvotes={post.downvotes}
          commentsCount={post.commentsCount}
          onCommentClick={() => setIsCommentDialogOpen(true)}
        />
      </CardFooter>

      {/* Comment Modal */}
      <Modal
        isOpen={isCommentDialogOpen}
        closeHandler={() => setIsCommentDialogOpen(false)}
        title={`Post by ${post.user.name}`}
        footer={
          <div className="flex gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://i.pravatar.cc/150?u=me" alt="Me" />
              <AvatarFallback>ME</AvatarFallback>
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
              <AvatarImage src={post.user.avatar} alt={post.user.name} />
              <AvatarFallback>{post.user.initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <div className="bg-secondary/30 rounded-2xl p-3">
                <span className="font-bold text-sm block mb-1">
                  {post.user.name}
                </span>
                <Paragraph className="text-sm">{post.content}</Paragraph>
              </div>
              <span className="text-[10px] text-muted-foreground px-1">
                {post.createdAt}
              </span>
            </div>
          </div>

          <Separator />

          {/* Comments List */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold px-1">Comments</h4>
            {post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={comment.user.avatar}
                      alt={comment.user.name}
                    />
                    <AvatarFallback>{comment.user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <div className="bg-secondary/50 rounded-2xl p-3">
                      <span className="font-bold text-sm block mb-1">
                        {comment.user.name}
                      </span>
                      <Paragraph className="text-sm">
                        {comment.content}
                      </Paragraph>
                    </div>
                    <div className="flex items-center gap-3 px-1">
                      <span className="text-[10px] text-muted-foreground">
                        {comment.createdAt}
                      </span>
                      <Button variant="link" className="h-auto p-0 text-[10px]">
                        Like
                      </Button>
                      <Button variant="link" className="h-auto p-0 text-[10px]">
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-center text-muted-foreground py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </Modal>
    </Card>
  );
};
