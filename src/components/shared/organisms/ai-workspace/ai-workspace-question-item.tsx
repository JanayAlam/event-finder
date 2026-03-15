"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import React from "react";

interface AIWorkspaceQuestionItemProps {
  prompt: string;
  isActive: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export const AIWorkspaceQuestionItem: React.FC<
  AIWorkspaceQuestionItemProps
> = ({ prompt, isActive, isLoading, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
        "border-border/60 bg-background/70 hover:bg-muted/40",
        isActive && "border-primary/40 bg-primary/5"
      )}
    >
      <div className="flex items-start gap-2">
        <span
          className={cn(
            "mt-0.5 flex h-6 w-6 items-center justify-center rounded-md",
            isActive ? "bg-primary/15 text-primary" : "bg-muted text-foreground"
          )}
        >
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <div className="flex flex-1 flex-col gap-1">
          <span className="line-clamp-2 text-sm font-medium text-foreground">
            {prompt}
          </span>
          <span className="text-xs text-muted-foreground">
            {isLoading ? "Thinking..." : "Ready"}
          </span>
        </div>
      </div>
    </button>
  );
};
