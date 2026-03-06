"use client";

import {
  IAIResultQueryItem,
  AISearchResultContent as SharedAISearchResultContent
} from "@/components/shared/organisms/ai-search-result-content";
import AIRepository from "@/repositories/ai.repository";
import { PUBLIC_PAGE_ROUTE } from "@/routes";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useCallback } from "react";
import { TAIPromptResponse } from "../../../../../common/types/ai.types";
import { AIQuerySection } from "./ai-query-section";

export const AISearchResultContentWrapper = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPrompt = searchParams.get("prompt") || "";

  const executeSearch = useCallback(async (prompt: string) => {
    const { result } = await AIRepository.executePrompt({ prompt });
    return result;
  }, []);

  return (
    <SharedAISearchResultContent<TAIPromptResponse>
      initialPrompt={initialPrompt}
      requireInitialPrompt
      onMissingInitialPrompt={() => router.push(PUBLIC_PAGE_ROUTE.HOME)}
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
