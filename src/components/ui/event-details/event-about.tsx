"use client";

import { Button } from "@/components/shared/shadcn-components/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/shared/shadcn-components/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/shared/shadcn-components/dialog";
import { Spinner } from "@/components/shared/shadcn-components/spinner";
import { Textarea } from "@/components/shared/shadcn-components/textarea";
import {
  H4,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { getImageUrl } from "@/lib/utils";
import EventRepository from "@/repositories/event.repository";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { TEventDetail } from "../../../../server/models/event.model";
import { EditItineraryDialog } from "./edit-itinerary-dialog";

interface EventAboutProps {
  event: TEventDetail;
}

export const EventAbout = ({ event }: EventAboutProps) => {
  const router = useRouter();

  const { user } = useAuthStore();

  const [isUploading, setIsUploading] = useState(false);
  const [removingPhoto, setRemovingPhoto] = useState<string | null>(null);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState(
    event.description ?? ""
  );

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

  const { mutate: updateDescription, isPending: isSavingDescription } =
    useMutation({
      mutationFn: (description: string) =>
        EventRepository.update(event._id.toString(), { description } as any),
      onSuccess: () => {
        toast.success("Description updated");
        setDescriptionOpen(false);
        router.refresh();
      },
      onError: () => toast.error("Failed to update description")
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
        <div className="flex items-center gap-2">
          <H4>About this event</H4>
          {isHost && (
            <Button
              id="edit-description-btn"
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setDescriptionDraft(event.description ?? "");
                setDescriptionOpen(true);
              }}
              title="Edit description"
              aria-label="Edit description"
            >
              <Pencil className="size-4" />
            </Button>
          )}
        </div>
        <TypographyMuted className="whitespace-pre-wrap">
          {event.description || "No description provided."}
        </TypographyMuted>
      </div>

      {/* Edit description dialog */}
      {isHost && (
        <Dialog open={descriptionOpen} onOpenChange={setDescriptionOpen}>
          <DialogContent className="max-w-lg w-full">
            <DialogHeader>
              <DialogTitle>Edit description</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 pt-1">
              <Textarea
                value={descriptionDraft}
                onChange={(e) => setDescriptionDraft(e.target.value)}
                placeholder="Describe your trip event..."
                className="h-40 resize-none"
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {descriptionDraft.length} / 1000
              </p>
              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDescriptionOpen(false)}
                  disabled={isSavingDescription}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => updateDescription(descriptionDraft)}
                  isLoading={isSavingDescription}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

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
          <div className="flex items-center gap-2">
            <H4>Itinerary</H4>
            {isHost && <EditItineraryDialog event={event} />}
          </div>
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
