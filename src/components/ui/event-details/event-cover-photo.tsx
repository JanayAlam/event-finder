import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/shared/shadcn-components/avatar";
import { getImageUrl } from "@/lib/utils";
import React from "react";
import { TEventDetail } from "../../../../server/models/event.model";

interface IEventCoverPhotoProps {
  event: TEventDetail;
}

export const EventCoverPhoto: React.FC<IEventCoverPhotoProps> = ({ event }) => {
  if (event.coverPhoto) {
    return (
      <Avatar className="h-50 sm:h-60 lg:h-80 w-full rounded-md sm:rounded-xl">
        <AvatarImage
          src={getImageUrl(event.coverPhoto)}
          alt={event.title}
          className="object-cover"
        />
        <AvatarFallback className="rounded-none bg-gradient-to-r from-violet-600 to-indigo-600" />
      </Avatar>
    );
  }

  return (
    <div className="h-50 sm:h-60 lg:h-80 w-full rounded-md sm:rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600"></div>
  );
};
