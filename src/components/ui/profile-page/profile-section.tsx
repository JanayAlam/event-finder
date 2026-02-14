import React from "react";
import { TEventListItemDto } from "../../../../common/types/event.types";
import { ProfileEventList } from "./profile-event-list";

interface ProfileSectionProps {
  showHosted: boolean;
  recentHostedEvents: TEventListItemDto[];
  recentJoinedEvents: TEventListItemDto[];
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  showHosted,
  recentHostedEvents,
  recentJoinedEvents
}) => {
  return (
    <div className="flex flex-col gap-4">
      {showHosted && (
        <ProfileEventList
          title="Recently hosted events"
          events={recentHostedEvents}
          emptyMessage="No events hosted yet"
        />
      )}
      <ProfileEventList
        title="Recently joined events"
        events={recentJoinedEvents}
        emptyMessage="No events joined yet"
      />
    </div>
  );
};
