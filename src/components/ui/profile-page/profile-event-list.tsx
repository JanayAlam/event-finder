import { LinkText } from "@/components/shared/atoms/link/link-text";
import TMCard from "@/components/shared/molecules/tm-card";
import EventCard from "@/components/shared/organisms/event-card";
import {
  Empty,
  EmptyContent,
  EmptyMedia
} from "@/components/shared/shadcn-components/empty";
import { H4 } from "@/components/shared/shadcn-components/typography";
import { FileX } from "lucide-react";
import React from "react";
import { TEvent } from "../../../../server/models/event.model";

interface IProfileEventListProps {
  title: string;
  emptyMessage?: string;
  events: TEvent[];
}

export const ProfileEventList: React.FC<IProfileEventListProps> = ({
  title,
  emptyMessage = "No events found",
  events
}) => {
  return (
    <TMCard
      title={
        <div className="flex gap-1 items-center justify-between">
          <H4>{title}</H4>
          <LinkText href={"#"}>Explore all</LinkText>
        </div>
      }
    >
      {events.length ? (
        events.map((event) => (
          <EventCard key={event._id.toString()} event={event} />
        ))
      ) : (
        <Empty className="gap-2">
          <EmptyMedia>
            <FileX />
          </EmptyMedia>
          <EmptyContent>{emptyMessage}</EmptyContent>
        </Empty>
      )}
    </TMCard>
  );
};
