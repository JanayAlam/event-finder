import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from "@/components/shared/shadcn-components/empty";
import { H1 } from "@/components/shared/shadcn-components/typography";
import { getImageUrl } from "@/lib/utils";
import EventRepository from "@/repositories/event.repository";
import { Metadata } from "next";
import Image from "next/image";

const fetchEvent = async (eventId: string) => {
  try {
    return EventRepository.getSingle(eventId);
  } catch {
    return null;
  }
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;
  const event = await fetchEvent(eventId);
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

  const event = await fetchEvent(eventId);

  if (!event) {
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

  const coverPhoto = getImageUrl(event.coverPhoto);

  return (
    <div className="text-center mt-50">
      <div className="h-50 sm:h-60 lg:h-80 w-full bg-red-900 rounded-md sm:rounded-xl">
        {coverPhoto ? <Image fill src={coverPhoto} alt={event.title} /> : null}
      </div>
    </div>
  );
}
