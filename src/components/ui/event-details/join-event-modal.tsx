"use client";

import Modal from "@/components/shared/organisms/modal/Modal";
import {
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import EventRepository from "@/repositories/event.repository";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import { TEventDetail } from "../../../../server/models/event.model";

interface IJoinEventModalProps {
  event: TEventDetail;
  isOpen: boolean;
  onClose: () => void;
}

export const JoinEventModal: React.FC<IJoinEventModalProps> = ({
  event,
  isOpen,
  onClose
}) => {
  const { mutate: joinEvent, isPending } = useMutation({
    mutationFn: async () => {
      return await EventRepository.join(event._id.toString());
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.success(data.message || "Joined event successfully");
        onClose();
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to join event");
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      closeHandler={onClose}
      okHandler={() => joinEvent()}
      loading={isPending}
      title="Join Event"
      okText={event.entryFee > 0 ? "Proceed Payment" : "Join Now"}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <div>
            <TypographyMuted className="text-xs font-semibold tracking-wider">
              Event
            </TypographyMuted>
            <Paragraph className="mt-0 text-xl font-bold leading-none">
              {event.title}
            </Paragraph>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <TypographyMuted className="text-xs font-semibold tracking-wider">
                Location
              </TypographyMuted>
              <Paragraph className="text-sm font-medium">
                {event.placeName}
              </Paragraph>
            </div>
            <div>
              <TypographyMuted className="text-xs font-semibold tracking-wider">
                Host
              </TypographyMuted>
              <Paragraph className="text-sm font-medium">
                {event.host.profile?.firstName} {event.host.profile?.lastName}
              </Paragraph>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-primary/10 p-4 border border-primary/20">
          <span className="font-semibold text-primary">Entry Fee</span>
          <span className="text-3xl font-black text-primary">
            BDT {event.entryFee}
          </span>
        </div>
      </div>
    </Modal>
  );
};
