"use client";

import { Button } from "@/components/shared/shadcn-components/button";
import EventRepository from "@/repositories/event.repository";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Facebook, Share2, UserCheck, UserPlus } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import {
  TEventDetail,
  TUserWithProfile
} from "../../../../server/models/event.model";

import { Spinner } from "@/components/shared/shadcn-components/spinner";
import { JoinEventModal } from "./join-event-modal";

interface IEventActionsProps {
  event: TEventDetail;
  /** Called after a successful Facebook post so the parent can refresh event data */
  onFacebookPosted?: (facebookPostId: string) => void;
}

export const EventActions: React.FC<IEventActionsProps> = ({
  event,
  onFacebookPosted
}) => {
  const { isLoggedIn, user } = useAuthStore();

  const [isJoinModalOpen, setIsJoinModalOpen] = React.useState(false);
  // Optimistically track posted state within this session
  const [postedToFacebook, setPostedToFacebook] = React.useState(
    event.isPostedToFacebook
  );

  const isHost = event.host._id.toString() === user?._id.toString();
  const isAdmin = user?.role === "admin";
  const isJoined = event.members.some(
    (m: TUserWithProfile) => m._id.toString() === user?._id.toString()
  );

  const showFacebookButton = isHost || isAdmin;

  const { mutate: publishToFacebook, isPending: isPosting } = useMutation({
    mutationFn: (eventId: string) => EventRepository.publishToFacebook(eventId),
    onSuccess: (data) => {
      setPostedToFacebook(true);

      const toastOptions = data.postUrl
        ? {
            action: {
              label: "View Post",
              onClick: () =>
                window.open(data.postUrl, "_blank", "noopener,noreferrer")
            }
          }
        : {};

      toast.success(
        data.message ?? "Event posted to Facebook successfully!",
        toastOptions
      );
      onFacebookPosted?.(data.facebookPostId);
    },
    onError: (err: unknown) => {
      let message = "Failed to post event to Facebook.";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message ?? message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast.error(message);
    }
  });

  const handleJoin = () => {
    if (!user) {
      toast.error("Please login to join the event");
      return;
    }
    setIsJoinModalOpen(true);
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
    if (postedToFacebook) {
      toast.info("This event has already been posted to Facebook.");
      return;
    }

    publishToFacebook(event._id.toString());
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {showFacebookButton && (
          <Button
            id="post-to-facebook-btn"
            size="lg"
            variant="outline"
            className="gap-2"
            onClick={handleFacebookPost}
            disabled={isPosting || postedToFacebook}
            title={
              postedToFacebook
                ? "Already posted to Facebook"
                : "Post this event to your connected Facebook page"
            }
          >
            {isPosting ? (
              <Spinner className="size-4" />
            ) : (
              <Facebook className="size-4" />
            )}
            <span className="hidden sm:inline">
              {postedToFacebook ? "Posted to Facebook" : "Post on Facebook"}
            </span>
          </Button>
        )}

        <Button
          id="join-event-btn"
          size="lg"
          variant="default"
          className="gap-2"
          onClick={handleJoin}
          disabled={!isLoggedIn || isJoined}
          title={
            !isLoggedIn
              ? "Please login to join the event"
              : isJoined
                ? "You have already joined the event"
                : "Click to join the event"
          }
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

        <Button
          id="share-event-btn"
          size="icon-lg"
          variant="ghost"
          onClick={handleShare}
        >
          <Share2 className="size-5" />
        </Button>
      </div>

      <JoinEventModal
        event={event}
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </>
  );
};
