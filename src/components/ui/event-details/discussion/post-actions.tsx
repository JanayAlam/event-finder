"use client";

import { Button } from "@/components/shared/shadcn-components/button";
import { MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import React from "react";

interface PostActionsProps {
  totalVotes: number;
  commentsCount: number;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  onUpvote: () => void;
  onDownvote: () => void;
  onCommentClick: () => void;
  onDelete?: () => void;
}

export const PostActions: React.FC<PostActionsProps> = ({
  totalVotes,
  commentsCount,
  hasUpvoted,
  hasDownvoted,
  onUpvote,
  onDownvote,
  onCommentClick,
  onDelete
}) => {
  return (
    <div className="flex items-center justify-between w-full pt-2">
      <div className="flex items-center gap-1 sm:gap-3">
        {/* Vote Group */}
        <div className="flex items-center bg-secondary/30 hover:bg-secondary/50 transition-colors rounded-full p-1 border border-border/40">
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 px-2 rounded-full transition-all duration-200 active:scale-90 hover:bg-transparent ${
              hasUpvoted
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onUpvote();
            }}
          >
            <ThumbsUp
              className={`size-4 transition-transform ${hasUpvoted ? "fill-current scale-110" : ""}`}
            />
          </Button>

          <div className="min-w-[2rem] flex items-center justify-center select-none">
            <span
              className={`text-sm font-bold transition-all ${
                hasUpvoted
                  ? "text-primary"
                  : hasDownvoted
                    ? "text-destructive"
                    : "text-foreground"
              }`}
            >
              {totalVotes}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className={`h-8 px-2 rounded-full transition-all duration-200 active:scale-90 hover:bg-transparent ${
              hasDownvoted
                ? "text-destructive bg-destructive/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onDownvote();
            }}
          >
            <ThumbsDown
              className={`size-4 transition-transform ${hasDownvoted ? "fill-current scale-110" : ""}`}
            />
          </Button>
        </div>

        {/* Comment Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-2 rounded-full transition-all hover:bg-secondary/50 text-muted-foreground hover:text-foreground active:scale-95"
          onClick={onCommentClick}
        >
          <div className="bg-secondary/60 p-1.5 rounded-full">
            <MessageSquare className="size-3.5" />
          </div>
          <span className="text-sm font-medium hidden sm:inline">Comment</span>
          <span className="text-sm font-semibold">{commentsCount}</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-full transition-all hover:bg-destructive/10 hover:text-destructive active:scale-90 text-muted-foreground/60"
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
