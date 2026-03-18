"use client";

import { IAIResultQueryItem } from "@/components/shared/organisms/ai-search-result-content";
import {
  AIEventCreateResultView,
  AIEventSearchResultView,
  AIQueryStatusView,
  AIWorkspace
} from "@/components/shared/organisms/ai-workspace";
import AIRepository from "@/repositories/ai.repository";
import EventDraftRepository from "@/repositories/event-draft.repository";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { toast } from "sonner";
import {
  TAIWorkspacePromptResponse,
  TGenerateEventPlanResponse
} from "../../../../../common/types/ai.types";

export const AIContent = () => {
  const router = useRouter();

  const [isCreatingDraftEvent, setIsCreatingDraftEvent] = useState(false);

  const executeSearch = async (prompt: string) => {
    const { result } = await AIRepository.executePrompt({ prompt });
    return result;
  };

  const handleCreateDraft = async (result: TGenerateEventPlanResponse) => {
    const toastId = toast.loading("Creating draft event...");
    setIsCreatingDraftEvent(true);
    try {
      const draft = await EventDraftRepository.create({
        ...result.eventToCreate,
        eventDate: new Date(result.eventToCreate.eventDate),
        itinerary: result.eventToCreate.itinerary.map((it) => ({
          ...it,
          moment: new Date(it.moment)
        })),
        additionalPhotos: []
      });
      toast.success("Draft event created", { id: toastId });
      router.push(`/events/create/d/${draft._id.toString()}`);
    } catch (error: any) {
      toast.error(error?.message || "Failed to create draft event", {
        id: toastId
      });
    } finally {
      setIsCreatingDraftEvent(false);
    }
  };

  return (
    <AIWorkspace<TAIWorkspacePromptResponse>
      executeSearch={executeSearch}
      renderQuery={({
        key,
        ...query
      }: IAIResultQueryItem<TAIWorkspacePromptResponse>) =>
        query.result?.events?.length ? (
          <AIEventSearchResultView
            id={key}
            showQuestion={false}
            isLoading={query.isLoading}
            prompt={query.prompt}
            result={{
              message: query.result.message,
              events: query.result.events || []
            }}
          />
        ) : query.result?.eventToCreate ? (
          <AIEventCreateResultView
            id={key}
            showQuestion={false}
            isLoading={query.isLoading}
            prompt={query.prompt}
            result={{
              message: query.result.message,
              eventToCreate: query.result.eventToCreate
            }}
            nextButtonText="Create draft event"
            isNextButtonLoading={isCreatingDraftEvent}
            onNext={handleCreateDraft}
          />
        ) : (
          <AIQueryStatusView
            isLoading={query.isLoading}
            message={query.result?.message}
          />
        )
      }
    />
  );
};
