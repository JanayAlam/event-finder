"use client";

import { Button } from "@/components/shared/shadcn-components/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/shared/shadcn-components/carousel";
import { Spinner } from "@/components/shared/shadcn-components/spinner";
import {
  H4,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { getImageUrl } from "@/lib/utils";
import EventRepository from "@/repositories/event.repository";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { TEventDetail } from "../../../../server/models/event.model";

interface EventAboutProps {
  event: TEventDetail;
}

export const EventAbout = ({ event }: EventAboutProps) => {
  const router = useRouter();

  const { user } = useAuthStore();

  const [isUploading, setIsUploading] = useState(false);
  const [removingPhoto, setRemovingPhoto] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isHost = event.host._id.toString() === user?._id?.toString();

  const allPhotos = [
    ...(event.additionalPhotos || []),
    ...(event.coverPhoto ? [event.coverPhoto] : [])
  ];

  const { mutateAsync: updateEventAsync } = useMutation({
    mutationFn: (data: { additionalPhotos: { path: string }[] }) =>
      EventRepository.update(event._id.toString(), data as any),
    onSuccess: () => {
      router.refresh();
    }
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const uploadPromise = (async () => {
      const { path } = await EventRepository.uploadAdditionalPhoto(file);
      const newAdditionalPhotos = [...(event.additionalPhotos || []), path].map(
        (p) => ({ path: p })
      );
      await updateEventAsync({ additionalPhotos: newAdditionalPhotos });
    })();

    toast.promise(uploadPromise, {
      loading: "Uploading photo...",
      success: "Photo added successfully",
      error: (error: any) =>
        error.response?.data?.message || error.message || "Failed to add photo"
    });

    try {
      await uploadPromise;
    } catch {
      // Error handled by toast.promise
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (photoPath: string) => {
    setRemovingPhoto(photoPath);

    const removePromise = (async () => {
      // Opt to also delete from storage
      await EventRepository.removePhoto(photoPath).catch(() => {});
      const newAdditionalPhotos = (event.additionalPhotos || [])
        .filter((p) => p !== photoPath)
        .map((p) => ({ path: p }));
      await updateEventAsync({ additionalPhotos: newAdditionalPhotos });
    })();

    toast.promise(removePromise, {
      loading: "Removing photo...",
      success: "Photo removed successfully",
      error: (error: any) =>
        error.response?.data?.message ||
        error.message ||
        "Failed to remove photo"
    });

    removePromise.finally(() => {
      setRemovingPhoto(null);
    });
  };

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
          <div className="flex items-center justify-between">
            <H4>Photos</H4>
            {isHost && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  title="Add new photo"
                >
                  {isUploading ? (
                    <Spinner className="size-4" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </>
            )}
          </div>
          {allPhotos.length ? (
            <div className="flex flex-col gap-4">
              <Carousel className="w-full">
                <CarouselContent>
                  {allPhotos.filter(Boolean).map((photo, index) => {
                    const isCoverPhoto = photo === event.coverPhoto;
                    return (
                      <CarouselItem key={index}>
                        <div className="relative aspect-square overflow-hidden rounded-xl border bg-secondary/20 group">
                          <Image
                            unoptimized
                            src={getImageUrl(photo)}
                            alt={`Event photo ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          {isHost && !isCoverPhoto && (
                            <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemove(photo)}
                                disabled={removingPhoto === photo}
                                className="bg-background/50 hover:bg-background/80 h-8 w-8"
                              >
                                {removingPhoto === photo ? (
                                  <Spinner
                                    className="size-4"
                                    color="text-destructive!"
                                  />
                                ) : (
                                  <Trash2 className="size-4 text-destructive" />
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </CarouselItem>
                    );
                  })}
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
