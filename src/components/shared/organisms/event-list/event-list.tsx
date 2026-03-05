"use client";

import React from "react";
import { TEventListItemDto } from "../../../../../common/types";
import TMCard from "../../molecules/tm-card";
import { Button } from "../../shadcn-components/button";
import { Empty, EmptyContent } from "../../shadcn-components/empty";
import { Skeleton } from "../../shadcn-components/skeleton";
import { Spinner } from "../../shadcn-components/spinner";
import { TypographyMuted } from "../../shadcn-components/typography";
import EventCard from "../event-card";

interface IEventListProps {
  events: TEventListItemDto[];
  isLoading: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage?: boolean;
  onLoadMore: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

const GRID_CLASSES =
  "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6";

const EventCardSkeleton = ({ dimmed = false }: { dimmed?: boolean }) => (
  <TMCard
    rootClassName="overflow-hidden"
    bodyClassName={`!p-0 flex flex-col ${dimmed ? "opacity-50" : ""}`}
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
);

export const EventList: React.FC<IEventListProps> = ({
  events,
  isLoading,
  isFetching,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  emptyTitle = "No upcoming trips found",
  emptyDescription = "Try checking back later or be the first to organize a new adventure!"
}) => {
  if (isLoading) {
    return (
      <div className={GRID_CLASSES}>
        {Array.from({ length: 8 }).map((_, idx) => (
          <EventCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (!events.length) {
    return (
      <Empty>
        <EmptyContent>
          <div className="flex flex-col gap-1">
            <p className="text-xl font-semibold">{emptyTitle}</p>
            <TypographyMuted>{emptyDescription}</TypographyMuted>
          </div>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <>
      <div className={GRID_CLASSES}>
        {events.map((event) => (
          <EventCard key={event._id.toString()} event={event} />
        ))}
        {isFetchingNextPage
          ? Array.from({ length: 4 }).map((_, idx) => (
              <EventCardSkeleton key={`loading-${idx}`} dimmed />
            ))
          : null}
      </div>

      {hasNextPage ? (
        <div className="flex justify-center mt-6">
          <Button
            onClick={onLoadMore}
            disabled={isFetching}
            variant="outline"
            className="min-w-32"
          >
            {isFetchingNextPage ? <Spinner className="mr-2" /> : "Load More"}
          </Button>
        </div>
      ) : null}
    </>
  );
};
