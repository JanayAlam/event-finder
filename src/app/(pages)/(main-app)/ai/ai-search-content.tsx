"use client";

import { AIPromptForm } from "@/components/shared/organisms/ai-prompt-form/ai-prompt-form";
import AIRepository from "@/repositories/ai.repository";
import { PUBLIC_PAGE_ROUTE } from "@/routes";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  IAIQueryItem,
  TPromtRequestDto
} from "../../../../../common/types/ai.types";
import { AIQuerySection } from "./ai-query-section";

const generateKey = () => dayjs().valueOf().toString();

export const AISearchResultContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPrompt = searchParams.get("prompt") || "";

  const scrollRef = useRef<HTMLDivElement>(null);

  const [queries, setQueries] = useState<IAIQueryItem[]>([]);

  const executeSearch = useCallback(async (prompt: string, key: string) => {
    try {
      const { result } = await AIRepository.executePrompt({ prompt });

      setQueries((prev) =>
        prev.map((q) =>
          q.key === key ? { ...q, result: result, isLoading: false } : q
        )
      );
    } catch {
      setQueries((prev) =>
        prev.map((q) => (q.key === key ? { ...q, isLoading: false } : q))
      );
    }
  }, []);

  useEffect(() => {
    if (initialPrompt && queries.length === 0) {
      const key = generateKey();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQueries([{ prompt: initialPrompt, key, isLoading: true }]);
      executeSearch(initialPrompt, key);
    }
  }, [initialPrompt, executeSearch, queries.length]);

  const onSubmit = ({ prompt }: TPromtRequestDto) => {
    const key = generateKey();
    setQueries((prev) => [...prev, { prompt, key, isLoading: true }]);
    executeSearch(prompt, key);
  };
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [queries]);

  const isGlobalLoading = queries.some((q) => q.isLoading);

  if (!initialPrompt) {
    router.push(PUBLIC_PAGE_ROUTE.HOME);
    return;
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-4"
      >
        <div className="flex flex-col gap-8">
          {queries.map(({ key, ...query }) => (
            <AIQuerySection key={key} id={key} {...query} />
          ))}
        </div>
      </div>

      <AIPromptForm onSubmit={onSubmit} isGlobalLoading={isGlobalLoading} />
    </div>
  );
};
