"use client";

import React from "react";
import { TEventListItemDto } from "../../../../../common/types";
import EFCard from "../../molecules/ef-card";
import { Button } from "../../shadcn-components/button";
import { Empty, EmptyContent } from "../../shadcn-components/empty";
import { Skeleton } from "../../shadcn-components/skeleton";
import { Spinner } from "../../shadcn-components/spinner";
import { TypographyMuted } from "../../shadcn-components/typography";
import EventItem from "../event-item";

interface IEventListProps {
  events?: TEventListItemDto[];
  isLoading?: boolean;
  isFetching?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

const LIST_CLASSES = "flex flex-col gap-3";

const EventItemSkeleton = ({ dimmed = false }: { dimmed?: boolean }) => (
  <div
    className={`rounded-xl border border-border/50 bg-background/80 p-4 ${
      dimmed ? "opacity-50" : ""
    }`}
  >
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <Skeleton className="h-20 w-full rounded-lg md:h-24 md:w-24 md:flex-none" />
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-3 md:w-40 md:items-end">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  </div>
);

export const EventList: React.FC<IEventListProps> = ({
  events = [],
  isLoading = false,
  isFetching = false,
  isFetchingNextPage = false,
  hasNextPage,
  onLoadMore,
  emptyTitle = "No upcoming trips found",
  emptyDescription = "Try checking back later or be the first to organize a new adventure!"
}) => {
  if (isLoading) {
    return (
      <div className={LIST_CLASSES}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <EventItemSkeleton key={idx} />
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
      <div className={LIST_CLASSES}>
        {events.map((event) => (
          <EventItem key={event._id.toString()} event={event} />
        ))}
        {isFetchingNextPage
          ? Array.from({ length: 2 }).map((_, idx) => (
              <EventItemSkeleton key={`loading-${idx}`} dimmed />
            ))
          : null}
      </div>

      {hasNextPage && onLoadMore ? (
        <div className="flex justify-center mt-6!">
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
