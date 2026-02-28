"use client";

import TMCard from "@/components/shared/molecules/tm-card";
import EventCard from "@/components/shared/organisms/event-card";
import { Skeleton } from "@/components/shared/shadcn-components/skeleton";
import {
  H2,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import EventRepository from "@/repositories/event.repository";
import { useQuery } from "@tanstack/react-query";
import { CalendarX, Search } from "lucide-react";

export default function ExplorePage() {
  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ["explore-events"],
    queryFn: async () => await EventRepository.getExploreEvents()
  });

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Search className="size-6 text-primary" />
          <H2>Explore Adventures</H2>
        </div>
        <TypographyMuted className="text-lg">
          Discover your next journey. Browse upcoming trips organized by our
          community members and find your perfect match.
        </TypographyMuted>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isEventsLoading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <TMCard
              key={idx}
              rootClassName="overflow-hidden"
              bodyClassName="!p-0 flex flex-col"
            >
              <Skeleton className="h-44 w-full rounded-none" />
              <div className="flex flex-col gap-4 p-4">
                <Skeleton className="h-6 w-3/4" />
                <div className="rounded-lg border p-3">
                  <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-4 w-40" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="size-4 rounded-full" />
                      <Skeleton className="h-3 w-14" />
                      <Skeleton className="size-4 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-10" />
                  </div>
                </div>
                <Skeleton className="h-4 w-2/3" />
                <div className="rounded-md bg-muted/40 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-14" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </TMCard>
          ))
        ) : !events?.length ? (
          <TMCard
            rootClassName="h-64 col-span-full"
            bodyClassName="h-full flex flex-col gap-3 items-center justify-center p-8 text-center"
          >
            <div className="bg-muted p-4 rounded-full">
              <CalendarX className="size-12 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xl font-semibold">No upcoming trips found</p>
              <TypographyMuted>
                Try checking back later or be the first to organize a new
                adventure!
              </TypographyMuted>
            </div>
          </TMCard>
        ) : (
          events.map((event) => (
            <EventCard key={event._id.toString()} event={event} />
          ))
        )}
      </div>
    </div>
  );
}
