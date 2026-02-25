"use client";

import { Button } from "@/components/shared/shadcn-components/button";
import EventRepository from "@/repositories/event.repository";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Facebook,
  Lock,
  Share2,
  ShieldBan,
  ShieldCheck,
  Unlock,
  UserCheck,
  UserPlus
} from "lucide-react";
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

  const [eventStatus, setEventStatus] = React.useState(event.status);

  const [now] = React.useState(() => Date.now());
  const isPassed = new Date(event.eventDate).getTime() < now;
  const isClosed = eventStatus === "closed";
  const isBlocked = eventStatus === "blocked";
  const isJoinable = !isPassed && !isClosed && !isBlocked;

  const getJoinButtonLabel = () => {
    if (isBlocked) return "Event Blocked";
    if (isClosed) return "Event Closed";
    if (isPassed) return "Event Passed";
    if (isJoined) return "Joined";
    return "Join Event";
  };

  const { mutate: toggleStatus, isPending: isTogglingStatus } = useMutation({
    mutationFn: (eventId: string) => EventRepository.toggleStatus(eventId),
    onSuccess: (data) => {
      setEventStatus(data.status as any);
      toast.success(data.message);
    },
    onError: (err: unknown) => {
      let message = "Failed to toggle event status.";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message ?? message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast.error(message);
    }
  });

  const { mutate: toggleBlock, isPending: isTogglingBlock } = useMutation({
    mutationFn: (eventId: string) => EventRepository.toggleBlock(eventId),
    onSuccess: (data) => {
      setEventStatus(data.status as any);
      toast.success(data.message);
    },
    onError: (err: unknown) => {
      let message = "Failed to toggle block status.";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message ?? message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast.error(message);
    }
  });

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
            disabled={isPosting || postedToFacebook || !isJoinable}
            title={
              !isJoinable
                ? "Cannot post when event is passed, closed, or blocked"
                : postedToFacebook
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
          variant={!isJoinable || isJoined ? "secondary" : "default"}
          className="gap-2"
          onClick={handleJoin}
          disabled={!isLoggedIn || isJoined || !isJoinable}
          title={
            !isLoggedIn
              ? "Please login to join the event"
              : isJoined
                ? "You have already joined the event"
                : !isJoinable
                  ? getJoinButtonLabel()
                  : "Click to join the event"
          }
        >
          {isJoined ? (
            <UserCheck className="size-4" />
          ) : !isJoinable ? (
            <Lock className="size-4" />
          ) : (
            <UserPlus className="size-4" />
          )}
          <span>{getJoinButtonLabel()}</span>
        </Button>

        {isHost && (
          <Button
            size="lg"
            variant="outline"
            className="gap-2"
            onClick={() => toggleStatus(event._id.toString())}
            disabled={isTogglingStatus || isBlocked}
          >
            {isTogglingStatus ? (
              <Spinner className="size-4" color="text-secondary-foreground!" />
            ) : isClosed ? (
              <Unlock className="size-4" />
            ) : (
              <Lock className="size-4" />
            )}
            <span className="hidden sm:inline">
              {isClosed ? "Open Event" : "Close Event"}
            </span>
          </Button>
        )}

        {isAdmin && (
          <Button
            size="lg"
            variant={isBlocked ? "outline" : "destructive"}
            className="gap-2"
            onClick={() => toggleBlock(event._id.toString())}
            disabled={isTogglingBlock}
          >
            {isTogglingBlock ? (
              <Spinner className="size-4" />
            ) : isBlocked ? (
              <ShieldCheck className="size-4" />
            ) : (
              <ShieldBan className="size-4" />
            )}
            <span className="hidden sm:inline">
              {isBlocked ? "Unblock Event" : "Block Event"}
            </span>
          </Button>
        )}

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
