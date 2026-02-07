"use client";

import TMCard from "@/components/shared/molecules/tm-card";
import EventCard from "@/components/shared/organisms/event-card";
import { Skeleton } from "@/components/shared/shadcn-components/skeleton";
import {
  H3,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { cn } from "@/lib/utils";
import EventRepository from "@/repositories/event.repository";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarX } from "lucide-react";
import Link from "next/link";

export default function UpcomingTripsSection() {
  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ["upcoming-trips"],
    queryFn: async () => await EventRepository.getAll()
  });

  return (
    <div className="flex flex-col gap-4 sm:py-4">
      <div>
        <div className="flex gap-1 items-center justify-between">
          <H3>Upcoming trips</H3>
          <Link
            href="#"
            className="max-sm:hidden hover:underline underline-offset-4 flex items-center gap-1 group hover:text-primary/90 dark:hover:text-primary"
          >
            Explore all
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:-rotate-45" />
          </Link>
        </div>
        <TypographyMuted>
          Discover exciting trips organized by fellow travelers. Join a group
          and explore together!
        </TypographyMuted>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isEventsLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton
              key={idx}
              className={cn(
                "h-48 w-full",
                idx >= 1 && "max-sm:hidden",
                idx >= 2 && "max-md:hidden",
                idx >= 3 && "max-lg:hidden"
              )}
            />
          ))
        ) : !events?.length ? (
          <TMCard
            rootClassName="h-48 col-span-4"
            bodyClassName="flex flex-col gap-2 items-center justify-center my-auto!"
          >
            <CalendarX className="size-12 text-muted-foreground" />
            <TypographyMuted>No trips found</TypographyMuted>
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
