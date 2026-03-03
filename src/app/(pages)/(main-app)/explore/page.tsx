"use client";

import TMCard from "@/components/shared/molecules/tm-card";
import EventCard from "@/components/shared/organisms/event-card";
import { Button } from "@/components/shared/shadcn-components/button";
import { Skeleton } from "@/components/shared/shadcn-components/skeleton";
import { Spinner } from "@/components/shared/shadcn-components/spinner";
import {
  H2,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import EventRepository from "@/repositories/event.repository";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CalendarX, Search } from "lucide-react";
import { useMemo } from "react";

export default function ExplorePage() {
  const limit = 12;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching
  } = useInfiniteQuery({
    queryKey: ["explore-events"],
    queryFn: ({ pageParam }) => EventRepository.getAll(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / limit);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    placeholderData: (previousData) => previousData
  });

  const allEvents = useMemo(() => {
    if (!data) return [];
    const flattened = data.pages.flatMap((page) => page.data);
    // Deduplicate by _id to maintain previous behavior (if necessary)
    return flattened.filter(
      (event, index, self) =>
        index === self.findIndex((e) => e._id === event._id)
    );
  }, [data]);

  const handleLoadMore = () => {
    fetchNextPage();
  };

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
        {isLoading ? (
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
        ) : allEvents.length === 0 && !isLoading ? (
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
          <>
            {allEvents.map((event) => (
              <EventCard key={event._id.toString()} event={event} />
            ))}
            {isFetchingNextPage
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <TMCard
                    key={`loading-${idx}`}
                    rootClassName="overflow-hidden"
                    bodyClassName="p-0! flex flex-col opacity-50"
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
              : null}
          </>
        )}
      </div>

      {hasNextPage ? (
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleLoadMore}
            disabled={isFetching}
            variant="outline"
            className="min-w-32"
          >
            {isFetchingNextPage ? <Spinner className="mr-2" /> : "Load More"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
