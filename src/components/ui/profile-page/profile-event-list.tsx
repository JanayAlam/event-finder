import TMCard from "@/components/shared/molecules/tm-card";
import EventCard from "@/components/shared/organisms/event-card";
import {
  Empty,
  EmptyContent,
  EmptyMedia
} from "@/components/shared/shadcn-components/empty";
import {
  H4,
  Paragraph
} from "@/components/shared/shadcn-components/typography";
import { ChevronRight, FileX } from "lucide-react";
import Link from "next/link";
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
          <Link href={"#"}>
            <Paragraph className="font-normal text-sm hover:underline flex items-center gap-1">
              Explore all
              <ChevronRight className="size-4" />
            </Paragraph>
          </Link>
        </div>
      }
    >
      {events.length ? (
        events.map((event) => (
          <EventCard key={event._id.toString()} event={event} />
        ))
      ) : (
        <Empty>
          <EmptyMedia>
            <FileX />
          </EmptyMedia>
          <EmptyContent>{emptyMessage}</EmptyContent>
        </Empty>
      )}
    </TMCard>
  );
};
