"use client";

import { PageLoader } from "@/components/shared/molecules/page-loader";
import { IAIResultQueryItem } from "@/components/shared/organisms/ai-search-result-content";
import { AIWorkspace } from "@/components/shared/organisms/ai-workspace";
import {
  Empty,
  EmptyContent,
  EmptyMedia
} from "@/components/shared/shadcn-components/empty";
import { AIEventPlanQuerySection } from "@/components/ui/create-event-page/ai-event-plan-query-section";
import AIRepository from "@/repositories/ai.repository";
import { Info } from "lucide-react";
import { TAIWorkplacePromptResponse } from "../../../../../common/types/ai.types";
import { AIQuerySection } from "./ai-query-section";

interface IAIQueryStatusProps {
  isLoading: boolean;
  message?: string;
}

const AIQueryStatus: React.FC<IAIQueryStatusProps> = ({
  isLoading,
  message
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (!message) {
    return null;
  }

  return (
    <Empty className="gap-2 py-8">
      <EmptyMedia variant="icon">
        <Info className="size-5" />
      </EmptyMedia>
      <EmptyContent>{message}</EmptyContent>
    </Empty>
  );
};

export const AIContent = () => {
  const executeSearch = async (prompt: string) => {
    const { result } = await AIRepository.executePrompt({ prompt });
    return result;
  };

  return (
    <AIWorkspace<TAIWorkplacePromptResponse>
      executeSearch={executeSearch}
      renderQuery={({
        key,
        ...query
      }: IAIResultQueryItem<TAIWorkplacePromptResponse>) =>
        query.result?.events?.length ? (
          <AIQuerySection
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
          <AIEventPlanQuerySection
            id={key}
            showQuestion={false}
            isLoading={query.isLoading}
            prompt={query.prompt}
            result={{
              message: query.result.message,
              eventToCreate: query.result.eventToCreate
            }}
            onNext={(_result) => {}}
          />
        ) : (
          <AIQueryStatus
            isLoading={query.isLoading}
            message={query.result?.message}
          />
        )
      }
    />
  );
};
