"use client";

import { ItineraryFormFields } from "@/components/shared/molecules/form";
import { Button } from "@/components/shared/shadcn-components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/shared/shadcn-components/dialog";
import EventRepository from "@/repositories/event.repository";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import dayjs from "dayjs";
import { Pencil } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UpdateEventSchema } from "../../../../common/validation-schemas";
import { TEventDetail } from "../../../../server/models/event.model";

interface EditItineraryDialogProps {
  event: TEventDetail;
}

type ItineraryFormValues = {
  itinerary: {
    moment: string;
    title: string;
    description?: string;
  }[];
};

export const EditItineraryDialog: React.FC<EditItineraryDialogProps> = ({
  event
}) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const buildDefaults = (): ItineraryFormValues => ({
    itinerary: (event.itinerary ?? []).map((item) => ({
      moment: item.moment
        ? dayjs(item.moment).format("YYYY-MM-DDTHH:mm")
        : new Date().toISOString(),
      title: item.title,
      description: item.description ?? ""
    }))
  });

  const form = useForm<ItineraryFormValues>({
    resolver: zodResolver(
      UpdateEventSchema.pick({ itinerary: true })
        // itinerary is optional in UpdateEventSchema, but we want it defined
        .extend({}) as any
    ),
    defaultValues: buildDefaults()
  });

  const { mutate: updateEvent, isPending } = useMutation({
    mutationFn: (itinerary: ItineraryFormValues["itinerary"]) =>
      EventRepository.update(event._id.toString(), { itinerary } as any),
    onSuccess: () => {
      toast.success("Itinerary updated successfully");
      setOpen(false);
      router.refresh();
    },
    onError: (err) => {
      const message = isAxiosError(err)
        ? err.response?.data?.message || "Failed to update itinerary"
        : "Failed to update itinerary";
      toast.error(message);
    }
  });

  const handleOpen = () => {
    form.reset(buildDefaults());
    setOpen(true);
  };

  const handleSubmit = form.handleSubmit((data) => {
    updateEvent(data.itinerary);
  });

  return (
    <>
      <Button
        id="edit-itinerary-btn"
        variant="ghost"
        size="icon"
        className="shrink-0 text-muted-foreground hover:text-foreground"
        onClick={handleOpen}
        title="Edit itinerary"
        aria-label="Edit itinerary"
      >
        <Pencil className="size-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Itinerary</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-1">
            <ItineraryFormFields control={form.control} />

            <div className="flex items-center justify-end gap-3 pt-1 border-t">
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
    </>
  );
};
