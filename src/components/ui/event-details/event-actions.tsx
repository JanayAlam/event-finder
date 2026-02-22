"use client";

import { Button } from "@/components/shared/shadcn-components/button";
import { useAuthStore } from "@/stores/auth-store";
import { Facebook, Share2, UserCheck, UserPlus } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import {
  TEventDetail,
  TUserWithProfile
} from "../../../../server/models/event.model";

interface IEventActionsProps {
  event: TEventDetail;
}

export const EventActions: React.FC<IEventActionsProps> = ({ event }) => {
  const { user } = useAuthStore();

  const isHost = event.host._id.toString() === user?._id.toString();
  const isAdmin = user?.role === "admin";
  const isJoined = event.members.some(
    (m: TUserWithProfile) => m._id.toString() === user?._id.toString()
  );

  const showFacebookButton = isHost || isAdmin;

  const handleJoin = () => {
    if (!user) {
      toast.error("Please login to join the event");
      return;
    }
    toast.info("Join functionality coming soon!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: event.title,
          text: event.description,
          url: window.location.href
        })
        .catch(() => toast.error("Failed to share"));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleFacebookPost = () => {
    toast.info("Facebook posting coming soon!");
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {showFacebookButton && (
        <Button
          size="lg"
          variant="outline"
          className="gap-2"
          onClick={handleFacebookPost}
        >
          <Facebook className="size-4" />
          <span className="hidden sm:inline">Post on Facebook</span>
        </Button>
      )}

      <Button
        size="lg"
        variant="default"
        className="gap-2"
        onClick={handleJoin}
        disabled={isJoined}
      >
        {isJoined ? (
          <>
            <UserCheck className="size-4" />
            <span>Joined</span>
          </>
        ) : (
          <>
            <UserPlus className="size-4" />
            <span>Join Event</span>
          </>
        )}
      </Button>

      <Button size="icon-lg" variant="ghost" onClick={handleShare}>
        <Share2 className="size-5" />
      </Button>
    </div>
  );
};
