"use client";

import { Button } from "@/components/shared/shadcn-components/button";
import { Separator } from "@/components/shared/shadcn-components/separator";
import {
  MessageSquare,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Trash2
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface PostActionsProps {
  upvotes: number;
  _downvotes: number;
  commentsCount: number;
  onCommentClick: () => void;
  onDelete?: () => void;
}

export const PostActions: React.FC<PostActionsProps> = ({
  upvotes,
  _downvotes,
  commentsCount,
  onCommentClick,
  onDelete
}) => {
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="flex items-center justify-between w-full pt-2">
      <div className="flex items-center gap-1 sm:gap-4">
        <div className="flex items-center bg-secondary/50 rounded-full p-1 px-2">
          <div className="h-7 w-7 flex items-center justify-center">
            <span className="text-xs font-medium">
              {upvotes + (upvoted ? 1 : 0)}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 px-2 rounded-full hover:bg-transparent ${upvoted ? "text-primary" : ""}`}
            onClick={() => {
              setUpvoted(!upvoted);
              if (downvoted) setDownvoted(false);
            }}
          >
            <ThumbsUp
              className={`w-4 h-4 mr-1 ${upvoted ? "fill-current" : ""}`}
            />
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 px-2 rounded-full hover:bg-transparent ${downvoted ? "text-destructive" : ""}`}
            onClick={() => {
              setDownvoted(!downvoted);
              if (upvoted) setUpvoted(false);
            }}
          >
            <ThumbsDown
              className={`w-4 h-4 ${downvoted ? "fill-current" : ""}`}
            />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-2 rounded-full"
          onClick={onCommentClick}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-xs font-medium hidden sm:inline">Comment</span>
          <span className="text-xs font-medium">{commentsCount}</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-2 rounded-full"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4" />
          <span className="text-xs font-medium hidden sm:inline">Share</span>
        </Button>

        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-transparent hover:text-destructive rounded-full"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
