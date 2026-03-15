import EFCard from "@/components/shared/molecules/ef-card";
import { EmptyList } from "@/components/shared/molecules/empty";
import EventCard from "@/components/shared/organisms/event-card";
import { H4 } from "@/components/shared/shadcn-components/typography";
import React from "react";
import { TEventListItemDto } from "../../../../common/types/event.types";

interface IProfileEventListProps {
  title: string | React.ReactNode;
  emptyMessage?: string;
  events: TEventListItemDto[];
}

export const ProfileEventList: React.FC<IProfileEventListProps> = ({
  title,
  emptyMessage = "No events found",
  events
}) => {
  return (
    <EFCard title={typeof title === "string" ? <H4>{title}</H4> : title}>
      {events.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <EventCard key={event._id.toString()} event={event} />
          ))}
        </div>
      ) : (
        <EmptyList message={emptyMessage} />
      )}
    </EFCard>
  );
};
