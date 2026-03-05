import { LinkText } from "@/components/shared/atoms/link/link-text";
import { H4 } from "@/components/shared/shadcn-components/typography";
import { PUBLIC_DYNAMIC_PAGE_ROUTE } from "@/routes";
import React from "react";
import { TEventListItemDto } from "../../../../common/types/event.types";
import { ProfileEventList } from "./profile-event-list";

interface ProfileSectionProps {
  userId: string;
  showHosted: boolean;
  recentHostedEvents: TEventListItemDto[];
  recentJoinedEvents: TEventListItemDto[];
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  userId,
  showHosted,
  recentHostedEvents,
  recentJoinedEvents
}) => {
  return (
    <div className="flex flex-col gap-4">
      {showHosted && (
        <ProfileEventList
          title={
            <div className="flex gap-1 items-center justify-between">
              <H4>Recently hosted events</H4>
              <LinkText
                href={PUBLIC_DYNAMIC_PAGE_ROUTE.EXPLORE_EVENTS_BY_HOST(userId)}
              >
                Explore all
              </LinkText>
            </div>
          }
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
