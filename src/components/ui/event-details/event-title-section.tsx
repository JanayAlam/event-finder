"use client";

import { InputField } from "@/components/shared/molecules/form";
import Modal from "@/components/shared/organisms/modal";
import { Button } from "@/components/shared/shadcn-components/button";
import { Badge } from "@/components/shared/shadcn-components/badge";
import { Input } from "@/components/shared/shadcn-components/input";
import { Label } from "@/components/shared/shadcn-components/label";
import { H1 } from "@/components/shared/shadcn-components/typography";
import { TypographyMuted } from "@/components/shared/shadcn-components/typography";
import {
  EVENT_TAG_VALUES,
  formatEventTagLabel,
  parseEventTagInput
} from "@/lib/event-tags";
import EventRepository from "@/repositories/event.repository";
import { useAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Pencil, Tags, X } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TUpdateEventForm } from "../../../../common/types";
import { UpdateEventSchema } from "../../../../common/validation-schemas";
import { EVENT_TAG } from "../../../../server/enums";
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
  const [tagsOpen, setTagsOpen] = React.useState(false);
  const [tagInput, setTagInput] = React.useState("");
  const [localTags, setLocalTags] = React.useState<EVENT_TAG[]>(
    event.tags ?? []
  );

  React.useEffect(() => {
    setLocalTags(event.tags ?? []);
  }, [event.tags]);

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
      EventRepository.update(event._id.toString(), {
        title: data.title,
        placeName: data.placeName,
        eventDate: new Date(data.eventDate as string),
        dayCount: data.dayCount as number,
        nightCount: data.nightCount as number,
        entryFee: data.entryFee as number,
        memberCapacity: data.memberCapacity as number
      }),
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

  const [removingTag, setRemovingTag] = React.useState<EVENT_TAG | null>(null);

  const { mutate: addTag, isPending: isAddingTag } = useMutation({
    mutationFn: (tag: EVENT_TAG) =>
      EventRepository.addTag(event._id.toString(), { tag }),
    onSuccess: (_, tag) => {
      toast.success("Tag added");
      setLocalTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
      setTagInput("");
      router.refresh();
    },
    onError: (err) => {
      const message = isAxiosError(err)
        ? err.response?.data?.message || "Failed to add tag"
        : "Failed to add tag";
      toast.error(message);
    }
  });

  const { mutate: removeTag, isPending: isRemovingTag } = useMutation({
    mutationFn: (tag: EVENT_TAG) =>
      EventRepository.removeTag(event._id.toString(), tag),
    onMutate: (tag) => {
      setRemovingTag(tag);
    },
    onSuccess: (_, tag) => {
      toast.success("Tag removed");
      setLocalTags((prev) => prev.filter((t) => t !== tag));
      router.refresh();
    },
    onError: (err) => {
      const message = isAxiosError(err)
        ? err.response?.data?.message || "Failed to remove tag"
        : "Failed to remove tag";
      toast.error(message);
    },
    onSettled: () => {
      setRemovingTag(null);
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

        <div className="flex flex-wrap items-center gap-2">
          {localTags.length ? (
            <div className="flex flex-wrap gap-1.5">
              {localTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="py-0.5">
                  {formatEventTagLabel(tag)}
                </Badge>
              ))}
            </div>
          ) : (
            <TypographyMuted className="text-xs">
              No tags added yet.
            </TypographyMuted>
          )}

          {isHost && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => setTagsOpen(true)}
              aria-label="Edit tags"
            >
              <Tags className="size-4" />
              Edit tags
            </Button>
          )}
        </div>
        <EventActions event={event} />
      </div>

      {/* Edit dialog — only rendered for host */}
      {isHost && (
        <Modal
          isOpen={open}
          closeHandler={() => setOpen(false)}
          title="Edit event details"
          footer={
            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isPending}
                form="edit-event-title-form"
              >
                Save Changes
              </Button>
            </div>
          }
          contentClassName="sm:max-w-lg"
        >
          <form
            onSubmit={handleSubmit}
            id="edit-event-title-form"
            className="flex flex-col gap-5 pt-1"
          >
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
          </form>
        </Modal>
      )}

      {/* Tag editor — only rendered for host */}
      {isHost && (
        <Modal
          isOpen={tagsOpen}
          closeHandler={() => setTagsOpen(false)}
          title="Edit tags"
          footer={
            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setTagsOpen(false)}
                disabled={isAddingTag || isRemovingTag}
              >
                Close
              </Button>
            </div>
          }
          contentClassName="sm:max-w-lg"
        >
          <div className="flex flex-col gap-4 pt-1">
            <div className="flex flex-col gap-2">
              <Label htmlFor="event-tag-input">Add tags</Label>
              <Input
                id="event-tag-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.shiftKey) {
                    e.preventDefault();
                    const parsed = parseEventTagInput(tagInput);
                    if (!parsed) {
                      toast.error(
                        "Unknown tag. Pick a value from the suggestions list."
                      );
                      return;
                    }
                    if (localTags.includes(parsed)) {
                      setTagInput("");
                      return;
                    }
                    addTag(parsed);
                  }
                }}
                placeholder="e.g. beach, trekking, budget"
                autoComplete="off"
                disabled={isAddingTag || isRemovingTag}
              />
              <div className="flex flex-wrap gap-1.5">
                {EVENT_TAG_VALUES.filter((t) => {
                  if (!tagInput.trim()) return true;
                  const normalized = tagInput
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, "_");
                  return t.includes(normalized);
                })
                  .slice(0, 12)
                  .map((t) => (
                    <button
                      key={t}
                      type="button"
                      className="text-xs rounded-md border border-muted-foreground/20 px-2 py-1 hover:bg-muted"
                      onClick={() => {
                        if (localTags.includes(t)) return;
                        addTag(t);
                      }}
                      disabled={isAddingTag || isRemovingTag}
                    >
                      {formatEventTagLabel(t)}
                    </button>
                  ))}
              </div>
              <TypographyMuted className="text-xs">
                Type or choose a tag, then press Shift+Enter to add it.
              </TypographyMuted>
            </div>

            <div className="flex flex-wrap gap-2">
              {localTags.length ? (
                localTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                    {formatEventTagLabel(tag)}
                    <button
                      type="button"
                      className="rounded-sm hover:bg-muted p-0.5"
                      onClick={() => removeTag(tag)}
                      disabled={
                        isAddingTag ||
                        isRemovingTag ||
                        removingTag === tag
                      }
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              ) : (
                <TypographyMuted className="text-xs">
                  No tags added yet.
                </TypographyMuted>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
