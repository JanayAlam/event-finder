import { EventMetaItem } from "@/components/shared/molecules/event-meta-item";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/shared/shadcn-components/avatar";
import { getImageUrl } from "@/lib/utils";
import { PUBLIC_DYNAMIC_PAGE_ROUTE } from "@/routes";
import dayjs from "dayjs";
import { Clock3, MapPin, MoveDown, Users } from "lucide-react";
import Link from "next/link";
import { TEventListItemDto } from "../../../../../common/types";
import TMCard from "../../molecules/tm-card";
import { Button } from "../../shadcn-components/button";
import { H4, Paragraph } from "../../shadcn-components/typography";

export default function EventCard({ event }: { event: TEventListItemDto }) {
  const startDate = dayjs(event.eventDate);
  const durationDays = Math.max(
    1,
    event.dayCount || 0,
    (event.nightCount || 0) + 1
  );
  const endDate = startDate.add(durationDays - 1, "day");

  return (
    <TMCard
      rootClassName="min-h-48 overflow-hidden"
      bodyClassName="!p-0 flex flex-col"
    >
      <Avatar className="h-44 w-full rounded-none">
        <AvatarImage
          src={event.coverPhoto ? getImageUrl(event.coverPhoto) : undefined}
          alt={event.title}
          className="object-cover"
        />
        <AvatarFallback className="rounded-none bg-gradient-to-r from-violet-600 to-indigo-600" />
      </Avatar>

      <div className="flex flex-col gap-4 p-4">
        <H4
          className="text-lg text-primary font-bold line-clamp-1"
          title={event.title}
        >
          {event.title}
        </H4>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
          <div className="flex flex-col items-center gap-2 text-center">
            <Paragraph className="text-sm font-semibold">
              {startDate.format("DD MMM YYYY, hh:mm A")}
            </Paragraph>
            <div className="flex items-center gap-2 text-primary">
              <Clock3 className="size-4" />
              <span className="text-xs font-semibold">
                {event.dayCount}D/{event.nightCount}N
              </span>
              <MoveDown className="size-4" />
            </div>
            <Paragraph className="text-sm font-semibold">
              {endDate.format("DD MMM YYYY")}
            </Paragraph>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <EventMetaItem icon={MapPin} text={event.placeName} />
          <EventMetaItem
            icon={Users}
            text={event.memberCapacity || "Unlimited"}
          />
        </div>

        <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2">
          <p className="text-sm text-muted-foreground">Entry fee</p>
          <p className="text-base font-semibold">Tk. {event.entryFee}</p>
        </div>

        <Link
          href={PUBLIC_DYNAMIC_PAGE_ROUTE.EVENT_DETAILS(event._id.toString())}
        >
          <Button className="w-full bg-primary hover:bg-primary/90 dark:text-primary">
            View details
          </Button>
        </Link>
      </div>
    </TMCard>
  );
}
