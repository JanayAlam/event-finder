"use client";

import { IAIResultQueryItem } from "@/components/shared/organisms/ai-search-result-content";
import { AIWorkspace } from "@/components/shared/organisms/ai-workspace";
import AIRepository from "@/repositories/ai.repository";
import { TAIPromptResponse } from "../../../../../common/types/ai.types";
import { AIQuerySection } from "./ai-query-section";

export const AIContent = () => {
  const executeSearch = async (prompt: string) => {
    const { result } = await AIRepository.executePrompt({ prompt });
    return result;
  };

  return (
    <AIWorkspace<TAIPromptResponse>
      executeSearch={executeSearch}
      renderQuery={({
        key,
        ...query
      }: IAIResultQueryItem<TAIPromptResponse>) => (
        <AIQuerySection id={key} showQuestion={false} {...query} />
      )}
    />
  );
};
