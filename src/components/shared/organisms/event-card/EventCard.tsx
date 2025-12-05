import { PUBLIC_DYNAMIC_PAGE_ROUTE } from "@/routes";
import dayjs from "dayjs";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { TEventListItemDto } from "../../../../../common/types";
import Card from "../../molecules/card";
import { Badge } from "../../shadcn-components/badge";
import { Button } from "../../shadcn-components/button";
import { H4, Paragraph } from "../../shadcn-components/typography";

export default function EventCard({ event }: { event: TEventListItemDto }) {
  return (
    <Card rootClassName="min-h-48" bodyClassName="flex flex-col gap-4">
      <H4 className="text-lg text-brand-primary-main font-bold">
        {event.title}
      </H4>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <MapPin className="size-4" />
          <Paragraph className="text-sm">{event.placeName}</Paragraph>
        </div>
        <div className="flex items-center gap-1">
          <CalendarDays className="size-4" />
          <Paragraph className="text-sm">
            {dayjs(event.eventDate).format("DD/MM/YYYY hh:mm:ss A")}
          </Paragraph>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1">
            <Clock className="size-4" />
            <Paragraph className="text-sm">
              {event.dayCount}D{event.nightCount ? `/${event.nightCount}N` : ""}
            </Paragraph>
          </div>
          {event.memberCapacity ? (
            <div className="flex items-center gap-1">
              <Users className="size-4" />
              <Paragraph className="text-sm">{event.memberCapacity}</Paragraph>
            </div>
          ) : null}
        </div>
      </div>
      <Badge className="text-md px-4 py-2" variant="outline">
        Tk. {event.entryFee}
      </Badge>

      <Link
        href={PUBLIC_DYNAMIC_PAGE_ROUTE.EVENT_DETAILS(event._id.toString())}
      >
        <Button className="w-full bg-brand-primary-main hover:bg-brand-primary-dark-1/90 dark:text-primary">
          View details
        </Button>
      </Link>
    </Card>
  );
}
