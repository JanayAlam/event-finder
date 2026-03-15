"use client";

import { EmptyData } from "@/components/shared/molecules/empty";
import { PageLoader } from "@/components/shared/molecules/page-loader";
import {
  H1,
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import EventDraftRepository from "@/repositories/event-draft.repository";
import { PUBLIC_PAGE_ROUTE } from "@/routes";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { TCreateEventForm, TEvent } from "../../../../../../../../common/types";
import { CreateEventForm } from "../../../../../../../components/ui/create-event-page/create-event-form";

const formatLocalDateTime = (value?: string | Date) => {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
};

const mapDraftToForm = (draft: TEvent): Partial<TCreateEventForm> => {
  return {
    title: draft.title ?? "",
    description: draft.description ?? "",
    placeName: draft.placeName ?? "",
    eventDate: formatLocalDateTime(draft.eventDate),
    entryFee: draft.entryFee ?? undefined,
    memberCapacity: draft.memberCapacity ?? undefined,
    dayCount: draft.dayCount ?? undefined,
    nightCount: draft.nightCount ?? undefined,
    itinerary:
      draft.itinerary?.map((item) => ({
        moment: formatLocalDateTime(item.moment) ?? "",
        title: item.title,
        description: item.description ?? ""
      })) ?? [],
    coverPhoto: draft.coverPhoto ?? undefined,
    additionalPhotos: draft.additionalPhotos?.map((path) => ({ path })) ?? []
  };
};

export default function CreateEventFromDraftPage() {
  const params = useParams();
  const rawDraftId = params?.draftId;
  const draftId = Array.isArray(rawDraftId) ? rawDraftId[0] : rawDraftId;

  const {
    data: draft,
    isLoading,
    error
  } = useQuery({
    queryKey: ["event-draft", draftId],
    queryFn: () => EventDraftRepository.getSingle(draftId || ""),
    enabled: Boolean(draftId)
  });

  const initialData = useMemo(
    () => (draft ? mapDraftToForm(draft) : undefined),
    [draft]
  );

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !draft || !draftId) {
    return <EmptyData message="Draft not found" />;
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href={PUBLIC_PAGE_ROUTE.HOME}>
        <Paragraph className="text-sm flex gap-2 items-center">
          <ArrowLeft className="size-4" />
          Back to home
        </Paragraph>
      </Link>

      <div className="flex flex-col gap-1">
        <H1 className="text-2xl">Continue event draft</H1>
        <TypographyMuted>
          Review the draft details and publish when you&apos;re ready
        </TypographyMuted>
      </div>

      <CreateEventForm initialData={initialData} draftId={draftId} />
    </div>
  );
}
