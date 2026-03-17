"use client";

import { IAIResultQueryItem } from "@/components/shared/organisms/ai-search-result-content";
import {
  AIEventCreateResultView,
  AIEventSearchResultView,
  AIQueryStatusView,
  AIWorkspace
} from "@/components/shared/organisms/ai-workspace";
import AIRepository from "@/repositories/ai.repository";
import { TAIWorkspacePromptResponse } from "../../../../../common/types/ai.types";

export const AIContent = () => {
  const executeSearch = async (prompt: string) => {
    const { result } = await AIRepository.executePrompt({ prompt });
    return result;
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
            onNext={(_result) => {}}
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
