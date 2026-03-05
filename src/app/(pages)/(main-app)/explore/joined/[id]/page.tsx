"use client";

import { EventList } from "@/components/shared/organisms/event-list";
import EventRepository from "@/repositories/event.repository";
import { useInfiniteQuery } from "@tanstack/react-query";
import { use, useMemo } from "react";

export default function ExploreJoinedEventsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const limit = 12;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching
  } = useInfiniteQuery({
    queryKey: ["explore-joined-events", id],
    queryFn: ({ pageParam }) =>
      EventRepository.getAll(pageParam, limit, { memberId: id }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / limit);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    placeholderData: (previousData) => previousData
  });

  const joinedEvents = useMemo(() => {
    if (!data) return [];
    const flattened = data.pages.flatMap((page) => page.data);
    return flattened.filter(
      (event, index, self) =>
        index === self.findIndex((e) => e._id === event._id)
    );
  }, [data]);

  return (
    <EventList
      events={joinedEvents}
      isLoading={isLoading}
      isFetching={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      onLoadMore={fetchNextPage}
      emptyTitle="No joined trips found"
      emptyDescription="This traveler has not joined any upcoming trips yet."
    />
  );
}
