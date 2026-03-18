"use client";

import { IconWithText } from "@/components/shared/icon-with-text";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/shared/shadcn-components/avatar";
import { Button } from "@/components/shared/shadcn-components/button";
import {
  Empty,
  EmptyContent
} from "@/components/shared/shadcn-components/empty";
import { Skeleton } from "@/components/shared/shadcn-components/skeleton";
import {
  H1,
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { getImageUrl } from "@/lib/utils";
import EventDraftRepository from "@/repositories/event-draft.repository";
import { useInfiniteQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { CalendarRange, Clock3, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { TEventListItemDto } from "../../../../../../common/types";

const LIST_CLASSES = "flex flex-col gap-3";

const DraftEventItemSkeleton = ({ dimmed = false }: { dimmed?: boolean }) => (
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

const DraftEventItem = ({ event }: { event: TEventListItemDto }) => {
  const startDate = dayjs(event.eventDate);
  const durationDays = Math.max(
    1,
    event.dayCount || 0,
    (event.nightCount || 0) + 1
  );
  const endDate = startDate.add(durationDays - 1, "day");

  return (
    <div className="rounded-xl border border-border/50 bg-background/80 p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Avatar className="h-20 w-full rounded-lg md:h-24 md:w-24 md:flex-none">
          <AvatarImage
            src={event.coverPhoto ? getImageUrl(event.coverPhoto) : undefined}
            alt={event.title}
            className="object-cover"
          />
          <AvatarFallback className="rounded-lg bg-linear-to-r from-violet-600 to-indigo-600" />
        </Avatar>

        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Paragraph
              className="text-base sm:text-lg font-semibold text-foreground line-clamp-1"
              title={event.title}
            >
              {event.title}
            </Paragraph>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CalendarRange className="h-4 w-4 text-primary" />
                {startDate.format("DD MMM YYYY")}
                <span className="text-muted-foreground/60">to</span>
                {endDate.format("DD MMM YYYY")}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-primary" />
                {event.dayCount}D/{event.nightCount}N
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <IconWithText icon={MapPin} text={event.placeName} />
            <IconWithText
              icon={Users}
              text={event.memberCapacity || "Unlimited"}
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-3 md:w-auto md:items-end">
          <div className="text-left md:text-right">
            <TypographyMuted className="text-xs uppercase tracking-wide">
              Entry fee
            </TypographyMuted>
            <Paragraph className="text-lg font-semibold text-foreground">
              Tk. {event.entryFee}
            </Paragraph>
          </div>

          <Link
            href={`/events/create/d/${event._id.toString()}`}
            className="w-full md:w-auto"
          >
            <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 dark:text-primary">
              Continue draft
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function DraftEventsPage() {
  const limit = 12;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching
  } = useInfiniteQuery({
    queryKey: ["draft-events"],
    queryFn: ({ pageParam }) => EventDraftRepository.getAll(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / limit);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    placeholderData: (previousData) => previousData
  });

  const allDrafts = useMemo(() => {
    if (!data) return [];
    const flattened = data.pages.flatMap((page) => page.data);
    return flattened.filter(
      (event, index, self) =>
        index === self.findIndex((item) => item._id === event._id)
    );
  }, [data]);

  const handleLoadMore = () => {
    fetchNextPage();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <H1 className="text-2xl">Draft events</H1>
        <TypographyMuted>
          Continue editing your saved drafts and publish whenever you&apos;re
          ready.
        </TypographyMuted>
      </div>

      {isLoading ? (
        <div className={LIST_CLASSES}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <DraftEventItemSkeleton key={idx} />
          ))}
        </div>
      ) : !allDrafts.length ? (
        <Empty>
          <EmptyContent>
            <div className="flex flex-col gap-1">
              <p className="text-xl font-semibold">No draft events yet</p>
              <TypographyMuted>
                Create an event draft from the AI workspace or start from
                scratch.
              </TypographyMuted>
            </div>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <div className={LIST_CLASSES}>
            {allDrafts.map((event) => (
              <DraftEventItem key={event._id.toString()} event={event} />
            ))}
            {isFetchingNextPage
              ? Array.from({ length: 2 }).map((_, idx) => (
                  <DraftEventItemSkeleton key={`loading-${idx}`} dimmed />
                ))
              : null}
          </div>

          {hasNextPage ? (
            <div className="flex justify-center mt-6!">
              <Button
                onClick={handleLoadMore}
                disabled={isFetching}
                variant="outline"
                className="min-w-32"
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
