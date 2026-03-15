"use client";

import { IconWithText } from "@/components/shared/icon-with-text";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/shared/shadcn-components/avatar";
import { getImageUrl } from "@/lib/utils";
import { PUBLIC_DYNAMIC_PAGE_ROUTE } from "@/routes";
import dayjs from "dayjs";
import { CalendarRange, Clock3, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { TEventListItemDto } from "../../../../../common/types";
import { EVENT_STATUS } from "../../../../../server/enums";
import { Badge } from "../../shadcn-components/badge";
import { Button } from "../../shadcn-components/button";
import { H4, Paragraph, TypographyMuted } from "../../shadcn-components/typography";

export default function EventItem({ event }: { event: TEventListItemDto }) {
  const startDate = dayjs(event.eventDate);
  const durationDays = Math.max(
    1,
    event.dayCount || 0,
    (event.nightCount || 0) + 1
  );
  const endDate = startDate.add(durationDays - 1, "day");

  const isPassed = startDate.isBefore(dayjs());

  let badgeProps: {
    label: string;
    variant: "destructive" | "secondary" | "default";
  } | null = null;
  if (event.status === EVENT_STATUS.BLOCKED) {
    badgeProps = { label: "Blocked", variant: "destructive" };
  } else if (event.status === EVENT_STATUS.CLOSED) {
    badgeProps = { label: "Closed", variant: "secondary" };
  } else if (isPassed || event.status === EVENT_STATUS.FINISHED) {
    badgeProps = { label: "Passed", variant: "secondary" };
  }

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
            <H4
              className="text-base sm:text-lg font-semibold text-foreground line-clamp-1"
              title={event.title}
            >
              {event.title}
            </H4>
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

          <div className="flex w-full items-center gap-2 md:w-auto md:flex-col md:items-end">
            {badgeProps && (
              <Badge
                variant={badgeProps.variant}
                className="h-8 px-3 text-xs"
              >
                {badgeProps.label}
              </Badge>
            )}
            <Link
              href={PUBLIC_DYNAMIC_PAGE_ROUTE.EVENT_DETAILS(
                event._id.toString()
              )}
              className="w-full md:w-auto"
            >
              <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 dark:text-primary">
                View details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
