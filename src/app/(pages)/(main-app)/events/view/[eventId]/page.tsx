import { EmptyData } from "@/components/shared/molecules/empty";
import {
  EventCoverPhoto,
  EventDetailsTabs,
  EventStatusAlert,
  EventTitleSection,
  PaymentFailedAlert
} from "@/components/ui/event-details";
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
      return <EmptyData message="Event not found" />;
    }
    throw error;
  }

  if (!event) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <PaymentFailedAlert />
        <EventStatusAlert event={event} />
        <EventCoverPhoto event={event} />
        <EventTitleSection event={event} />
      </div>

      <EventDetailsTabs event={event} />
    </div>
  );
}
