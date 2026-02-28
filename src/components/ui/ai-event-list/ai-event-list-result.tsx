import TMCard from "@/components/shared/molecules/tm-card";
import {
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { PUBLIC_DYNAMIC_PAGE_ROUTE } from "@/routes";
import dayjs from "dayjs";
import { Calendar, MapPin, Signpost } from "lucide-react";
import Link from "next/link";
import React from "react";
import { TAISearchEvent } from "../../../../common/types/ai.types";

interface IAIEventListResultProps {
  message: string;
  events: TAISearchEvent[];
}

export const AIEventListResult: React.FC<IAIEventListResultProps> = ({
  message,
  events
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Paragraph className="font-semibold text-lg">{message}</Paragraph>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {events.map((event) => (
          <Link
            key={event._id}
            href={PUBLIC_DYNAMIC_PAGE_ROUTE.EVENT_DETAILS(event._id)}
          >
            <TMCard
              rootClassName="group h-full scale-98 hover:scale-100 transition-all hover:bg-primary/10"
              title={
                <div className="flex flex-col gap-4">
                  <TypographyMuted className="flex items-center gap-2 group-hover:text-primary/80">
                    <MapPin className="size-4" />
                    {event.placeName}
                  </TypographyMuted>
                  <Paragraph className="font-bold">{event.title}</Paragraph>
                </div>
              }
              description={event.description}
              titleClassName="group-hover:text-primary"
              descriptionClassName="text-sm min-h-11.5 line-clamp-3"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <TypographyMuted className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    {dayjs(event.eventDate).format("DD MMM YYYY")}
                  </TypographyMuted>
                  <TypographyMuted className="flex items-center gap-2">
                    <Signpost className="size-4" />
                    {event.nightCount
                      ? `${event.dayCount} day${event.dayCount > 1 ? "s" : ""} ${event.nightCount} night${event.nightCount > 1 ? "s" : ""}`
                      : "Day long"}
                  </TypographyMuted>
                </div>
                <Paragraph className="font-semibold text-lg lg:text-xl group-hover:text-primary">
                  {event.entryFee} Tk
                </Paragraph>
              </div>
            </TMCard>
          </Link>
        ))}
      </div>
    </div>
  );
};
