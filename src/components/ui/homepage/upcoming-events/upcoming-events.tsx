"use client";

import { LinkText } from "@/components/shared/atoms/link/link-text";
import { EventList } from "@/components/shared/organisms/event-list";
import { H3 } from "@/components/shared/shadcn-components/typography";
import EventRepository from "@/repositories/event.repository";
import { PUBLIC_PAGE_ROUTE } from "@/routes";
import { useQuery } from "@tanstack/react-query";

export function UpcomingEvents() {
  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ["upcoming-trips"],
    queryFn: async () => await EventRepository.getUpcomingEvents()
  });

  return (
    <div className="flex flex-col gap-4 sm:py-4">
      <div className="flex gap-1 items-center justify-between">
        <H3>Upcoming experiences</H3>
        <LinkText href={PUBLIC_PAGE_ROUTE.EXPLORE}>Explore all</LinkText>
      </div>

      <EventList
        events={events ?? []}
        isLoading={isEventsLoading}
        emptyTitle="No trips found"
        emptyDescription="Be the first to host or check back soon for new adventures."
      />
    </div>
  );
}
