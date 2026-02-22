"use client";

import Modal from "@/components/shared/organisms/modal/Modal";
import {
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import React from "react";
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
  return (
    <Modal
      isOpen={isOpen}
      closeHandler={onClose}
      title={`Join ${event.title}`}
      okText="Proceed Payment"
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

          <div className="flex flex-row items-center justify-between gap-4">
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
