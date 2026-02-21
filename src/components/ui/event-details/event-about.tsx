"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/shared/shadcn-components/carousel";
import {
  H4,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { getImageUrl } from "@/lib/utils";
import dayjs from "dayjs";
import Image from "next/image";
import { TEventDetail } from "../../../../server/models/event.model";

interface EventAboutProps {
  event: TEventDetail;
}

export const EventAbout = ({ event }: EventAboutProps) => {
  const allPhotos = [
    ...(event.additionalPhotos || []),
    ...(event.coverPhoto ? [event.coverPhoto] : [])
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <H4>About this event</H4>
        <TypographyMuted className="whitespace-pre-wrap">
          {event.description || "No description provided."}
        </TypographyMuted>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Photos Carousel - Left Side (4/12) */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <H4>Photos</H4>
          {allPhotos.length ? (
            <div className="flex flex-col gap-4">
              <Carousel className="w-full">
                <CarouselContent>
                  {allPhotos.filter(Boolean).map((photo, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-square overflow-hidden rounded-xl border bg-secondary/20">
                        <Image
                          unoptimized
                          src={getImageUrl(photo)}
                          alt={`Event photo ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex items-center justify-center gap-2 mt-2!">
                  <CarouselPrevious className="static translate-y-0" />
                  <CarouselNext className="static translate-y-0" />
                </div>
              </Carousel>
            </div>
          ) : (
            <TypographyMuted>No photos available.</TypographyMuted>
          )}
        </div>

        {/* Itinerary - Right Side (8/12) */}
        <div className="md:col-span-8 flex flex-col gap-4">
          <H4>Itinerary</H4>
          {event.itinerary && event.itinerary.length > 0 ? (
            <div className="flex flex-col gap-6">
              {event.itinerary.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-1 border-l-2 border-primary/20 pl-6 relative"
                >
                  <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    {dayjs(item.moment).format("MMM D, YYYY h:mm A")}
                  </span>
                  <span className="font-semibold text-lg">{item.title}</span>
                  {item.description && (
                    <TypographyMuted className="text-sm whitespace-pre-wrap">
                      {item.description}
                    </TypographyMuted>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <TypographyMuted>No itinerary provided.</TypographyMuted>
          )}
        </div>
      </div>
    </div>
  );
};
