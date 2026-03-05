"use client";

import { AIPromptForm } from "@/components/shared/organisms/ai-prompt-form/ai-prompt-form";
import dayjs from "dayjs";
import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TPromtRequestDto } from "../../../../../common/types/ai.types";
import { Empty, EmptyContent, EmptyMedia } from "../../shadcn-components/empty";

const generateKey = () => dayjs().valueOf().toString();

export interface IAIResultQueryItem<TResult> {
  key: string;
  prompt: string;
  result?: TResult;
  isLoading: boolean;
}

interface IAISearchResultContentProps<TResult> {
  executeSearch: (prompt: string) => Promise<TResult>;
  renderQuery: (query: IAIResultQueryItem<TResult>) => React.ReactNode;
  initialPrompt?: string;
  requireInitialPrompt?: boolean;
  onMissingInitialPrompt?: () => void;
  onResult?: (result: TResult, prompt: string) => void;
  onError?: (error: unknown, prompt: string) => void;
  className?: string;
}

export function AISearchResultContent<TResult>({
  executeSearch,
  renderQuery,
  initialPrompt = "",
  requireInitialPrompt = false,
  onMissingInitialPrompt,
  onResult,
  onError,
  className = "h-[calc(100vh-120px)] flex flex-col gap-6"
}: IAISearchResultContentProps<TResult>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [queries, setQueries] = useState<IAIResultQueryItem<TResult>[]>([]);

  useEffect(() => {
    if (requireInitialPrompt && !initialPrompt) {
      onMissingInitialPrompt?.();
    }
  }, [initialPrompt, onMissingInitialPrompt, requireInitialPrompt]);

  const runSearch = useCallback(
    async (prompt: string, key: string) => {
      try {
        const result = await executeSearch(prompt);

        setQueries((prev) =>
          prev.map((q) =>
            q.key === key ? { ...q, result, isLoading: false } : q
          )
        );
        onResult?.(result, prompt);
      } catch (error) {
        setQueries((prev) =>
          prev.map((q) => (q.key === key ? { ...q, isLoading: false } : q))
        );
        onError?.(error, prompt);
      }
    },
    [executeSearch, onError, onResult]
  );

  useEffect(() => {
    if (initialPrompt && queries.length === 0) {
      const key = generateKey();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQueries([{ prompt: initialPrompt, key, isLoading: true }]);
      runSearch(initialPrompt, key);
    }
  }, [initialPrompt, queries.length, runSearch]);

  const onSubmit = ({ prompt }: TPromtRequestDto) => {
    const key = generateKey();
    setQueries((prev) => [...prev, { prompt, key, isLoading: true }]);
    runSearch(prompt, key);
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

  return (
    <div className={className}>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-4"
      >
        <div className="flex flex-col gap-8">
          {queries.length > 0 ? (
            queries.map((query) => (
              <div key={query.key}>{renderQuery(query)}</div>
            ))
          ) : (
            <Empty className="gap-2">
              <EmptyMedia>
                <Sparkles className="size-6" />
              </EmptyMedia>
              <EmptyContent>Write something to get started</EmptyContent>
            </Empty>
          )}
        </div>
      </div>

      <AIPromptForm onSubmit={onSubmit} isGlobalLoading={isGlobalLoading} />
    </div>
  );
}
