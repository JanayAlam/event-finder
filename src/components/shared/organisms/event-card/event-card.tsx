import { EventMetaItem } from "@/components/shared/molecules/event-meta-item";
import { PUBLIC_DYNAMIC_PAGE_ROUTE } from "@/routes";
import dayjs from "dayjs";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { TEventListItemDto } from "../../../../../common/types";
import TMCard from "../../molecules/tm-card";
import { Badge } from "../../shadcn-components/badge";
import { Button } from "../../shadcn-components/button";
import { H4 } from "../../shadcn-components/typography";

export default function EventCard({ event }: { event: TEventListItemDto }) {
  return (
    <TMCard rootClassName="min-h-48" bodyClassName="flex flex-col gap-4">
      <H4 className="text-lg text-primary font-bold">{event.title}</H4>
      <div className="flex flex-col gap-2">
        <EventMetaItem icon={MapPin} text={event.placeName} />
        <EventMetaItem
          icon={CalendarDays}
          text={dayjs(event.eventDate).format("DD/MM/YY hh:mm A")}
        />
        <div className="flex gap-4 items-center">
          <EventMetaItem
            icon={Clock}
            text={`${event.dayCount}D${event.nightCount ? `/${event.nightCount}N` : ""}`}
          />
          {event.memberCapacity ? (
            <EventMetaItem icon={Users} text={event.memberCapacity} />
          ) : null}
        </div>
      </div>
      <Badge className="text-md px-4 py-2" variant="outline">
        Tk. {event.entryFee}
      </Badge>

      <Link
        href={PUBLIC_DYNAMIC_PAGE_ROUTE.EVENT_DETAILS(event._id.toString())}
      >
        <Button className="w-full bg-primary hover:bg-primary/90 dark:text-primary">
          View details
        </Button>
      </Link>
    </TMCard>
  );
}
