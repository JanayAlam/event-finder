"use client";

import {
  IAIResultQueryItem,
  AISearchResultContent as SharedAISearchResultContent
} from "@/components/shared/organisms/ai-search-result-content";
import AIRepository from "@/repositories/ai.repository";
import { TAIPromptResponse } from "../../../../../common/types/ai.types";
import { AIQuerySection } from "./ai-query-section";

export const AISearchResultContentWrapper = () => {
  const executeSearch = async (prompt: string) => {
    const { result } = await AIRepository.executePrompt({ prompt });
    return result;
  };

  return (
    <SharedAISearchResultContent<TAIPromptResponse>
      executeSearch={executeSearch}
      renderQuery={({
        key,
        ...query
      }: IAIResultQueryItem<TAIPromptResponse>) => (
        <AIQuerySection id={key} {...query} />
      )}
    />
  );
};

export const AISearchResultContent = AISearchResultContentWrapper;
