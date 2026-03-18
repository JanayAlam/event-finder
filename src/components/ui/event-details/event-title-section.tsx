"use client";

import { InputField } from "@/components/shared/molecules/form";
import { Button } from "@/components/shared/shadcn-components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/shared/shadcn-components/dialog";
import { H1 } from "@/components/shared/shadcn-components/typography";
import EventRepository from "@/repositories/event.repository";
import { useAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TUpdateEventForm } from "../../../../common/types";
import { UpdateEventSchema } from "../../../../common/validation-schemas";
import { TEventDetail } from "../../../../server/models/event.model";
import { EventActions } from "./event-actions";
import { EventMetaList } from "./event-meta-list";

interface EventTitleSectionProps {
  event: TEventDetail;
}

export const EventTitleSection: React.FC<EventTitleSectionProps> = ({
  event
}) => {
  const { user } = useAuthStore();
  const router = useRouter();
  const isHost = event.host._id.toString() === user?._id.toString();

  const [open, setOpen] = React.useState(false);

  const form = useForm<TUpdateEventForm>({
    resolver: zodResolver(UpdateEventSchema),
    defaultValues: {
      title: event.title,
      placeName: event.placeName,
      eventDate: event.eventDate
        ? new Date(event.eventDate).toISOString()
        : undefined,
      dayCount: event.dayCount,
      nightCount: event.nightCount,
      entryFee: event.entryFee,
      memberCapacity: event.memberCapacity
    }
  });

  const { mutate: updateEvent, isPending } = useMutation({
    mutationFn: (data: TUpdateEventForm) =>
      EventRepository.update(event._id.toString(), data as any),
    onSuccess: () => {
      toast.success("Event updated successfully");
      setOpen(false);
      router.refresh();
    },
    onError: (err) => {
      const message = isAxiosError(err)
        ? err.response?.data?.message || "Failed to update event"
        : "Failed to update event";
      toast.error(message);
    }
  });

  const handleSubmit = form.handleSubmit((data) => {
    updateEvent(data);
  });

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Title row with optional edit button */}
        <div className="flex items-start gap-2">
          <H1 className="font-semibold text-xl sm:text-3xl flex-1">
            {event.title}
          </H1>

          {isHost && (
            <Button
              id="edit-event-btn"
              variant="ghost"
              size="icon"
              className="shrink-0 mt-0.5 text-muted-foreground hover:text-foreground"
              onClick={() => {
                form.reset({
                  title: event.title,
                  placeName: event.placeName,
                  eventDate: event.eventDate
                    ? new Date(event.eventDate).toISOString()
                    : undefined,
                  dayCount: event.dayCount,
                  nightCount: event.nightCount,
                  entryFee: event.entryFee,
                  memberCapacity: event.memberCapacity
                });
                setOpen(true);
              }}
              title="Edit event details"
              aria-label="Edit event details"
            >
              <Pencil className="size-4" />
            </Button>
          )}
        </div>

        <EventMetaList event={event} />
        <EventActions event={event} />
      </div>

      {/* Edit dialog — only rendered for host */}
      {isHost && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg w-full">
            <DialogHeader>
              <DialogTitle>Edit event details</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-1">
              <InputField
                isRequired
                control={form.control}
                type="text"
                label="Event Title"
                name="title"
                placeholder="e.g., Weekend Mountain Hiking Adventure"
              />

              <InputField
                isRequired
                control={form.control}
                type="text"
                label="Location"
                name="placeName"
                placeholder="e.g., Saint Martin Island, Bangladesh"
              />

              <InputField
                isRequired
                control={form.control}
                type="datetime-local"
                label="Event Date"
                name="eventDate"
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  isRequired
                  control={form.control}
                  type="number"
                  label="Days"
                  name="dayCount"
                  placeholder="e.g., 2"
                />
                <InputField
                  isRequired
                  control={form.control}
                  type="number"
                  label="Nights"
                  name="nightCount"
                  placeholder="e.g., 1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  isRequired
                  control={form.control}
                  type="number"
                  label="Entry Fee (BDT)"
                  name="entryFee"
                  placeholder="e.g., 2500  (enter 0 for free)"
                />
                <InputField
                  control={form.control}
                  type="number"
                  label="Members"
                  name="memberCapacity"
                  placeholder="e.g., 20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={isPending}>
                  Save Changes
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
