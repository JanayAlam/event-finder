import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/shared/shadcn-components/avatar";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from "@/components/shared/shadcn-components/empty";
import { H1 } from "@/components/shared/shadcn-components/typography";
import { EventDetailsTabs, EventMetaList } from "@/components/ui/event-details";
import { getImageUrl } from "@/lib/utils";
import EventRepository from "@/repositories/event.repository";
import { Metadata } from "next";

const fetchEvent = async (eventId: string) => {
  try {
    const data = await EventRepository.getSingle(eventId);
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;
  const { data: event } = await fetchEvent(eventId);
  return {
    title: event?.title || "Event details"
  };
}

export default async function EventDetailsPage({
  params
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const { data: event, error } = await fetchEvent(eventId);

  if (error) {
    if (error.response?.status === 404) {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>
              <H1>Event Not Found</H1>
            </EmptyTitle>
            <EmptyDescription>
              The event you&apos;re looking for doesn&apos;t exist.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      );
    }
    throw error;
  }

  if (!event) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {event.coverPhoto ? (
          <Avatar className="h-50 sm:h-60 lg:h-80 w-full rounded-md sm:rounded-xl">
            <AvatarImage
              src={getImageUrl(event.coverPhoto)}
              alt={event.title}
              className="object-cover"
            />
            <AvatarFallback className="rounded-none bg-gradient-to-r from-violet-600 to-indigo-600" />
          </Avatar>
        ) : (
          <div className="h-50 sm:h-60 lg:h-80 w-full rounded-md sm:rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600"></div>
        )}
        <div className="flex flex-col gap-3">
          <H1 className="font-semibold text-xl sm:text-3xl">{event.title}</H1>
          <EventMetaList event={event} />
        </div>
      </div>

      <EventDetailsTabs event={event} />
    </div>
  );
}
