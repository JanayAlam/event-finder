"use client";

import { AIPromptForm } from "@/components/shared/organisms/ai-prompt-form";
import {
  Tabs,
  TabsList,
  TabsTrigger
} from "@/components/shared/shadcn-components/tabs";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { Sparkles } from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { TPromptRequestDto } from "../../../../../common/types/ai.types";
import { EmptyList } from "../../molecules/empty";
import { Empty, EmptyContent, EmptyMedia } from "../../shadcn-components/empty";
import { TypographyMuted } from "../../shadcn-components/typography";
import { IAIResultQueryItem } from "../ai-search-result-content";
import { AIWorkspaceQuestionItem } from "./ai-workspace-question-item";

const generateKey = () => dayjs().valueOf().toString();

interface IAIWorkspaceProps<TResult> {
  executeSearch: (prompt: string) => Promise<TResult>;
  renderQuery: (query: IAIResultQueryItem<TResult>) => React.ReactNode;
  onResult?: (result: TResult, prompt: string) => void;
  onError?: (error: unknown, prompt: string) => void;
  className?: string;
  inputPlaceholder?: string;
}

export function AIWorkspace<TResult>({
  executeSearch,
  renderQuery,
  inputPlaceholder,
  onResult,
  onError,
  className
}: IAIWorkspaceProps<TResult>) {
  const listRef = useRef<HTMLDivElement>(null);

  const [queries, setQueries] = useState<IAIResultQueryItem<TResult>[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);

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

  const onSubmit = ({ prompt }: TPromptRequestDto) => {
    const key = generateKey();
    setQueries((prev) => [...prev, { prompt, key, isLoading: true }]);
    setActiveKey(key);
    runSearch(prompt, key);
  };

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [queries]);

  const activeQuery = useMemo(() => {
    if (!queries.length) return null;
    if (!activeKey) return queries[queries.length - 1];
    return (
      queries.find((q) => q.key === activeKey) ?? queries[queries.length - 1]
    );
  }, [activeKey, queries]);

  const isGlobalLoading = queries.some((q) => q.isLoading);

  return (
    <div
      className={cn(
        "h-[calc(100vh-120px)] flex flex-col gap-4 pt-6 md:grid md:grid-cols-12 md:gap-6",
        className
      )}
    >
      <div className="flex flex-col gap-4 md:col-span-4 md:h-full">
        <div className="md:hidden flex flex-col gap-4">
          <AIPromptForm
            onSubmit={onSubmit}
            isGlobalLoading={isGlobalLoading}
            placeholder={inputPlaceholder}
          />

          {queries.length ? (
            <Tabs value={activeQuery?.key} onValueChange={setActiveKey}>
              <TabsList className="w-full justify-start gap-2 overflow-x-auto rounded-full bg-muted/40 p-1">
                {queries.map((query) => (
                  <TabsTrigger
                    key={query.key}
                    value={query.key}
                    className="whitespace-nowrap rounded-full px-4"
                  >
                    {query.prompt}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          ) : (
            <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-4">
              <TypographyMuted className="text-sm">
                Your questions will appear here.
              </TypographyMuted>
            </div>
          )}
        </div>

        <div className="hidden md:flex md:flex-1 md:flex-col md:gap-4">
          {queries.length ? (
            <div className="flex items-center justify-between">
              <TypographyMuted className="text-sm">
                Recent activites
              </TypographyMuted>
            </div>
          ) : null}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-2 pr-1"
          >
            {queries.length ? (
              queries.map((query) => (
                <AIWorkspaceQuestionItem
                  key={query.key}
                  prompt={query.prompt}
                  isActive={query.key === activeQuery?.key}
                  isLoading={query.isLoading}
                  onClick={() => setActiveKey(query.key)}
                />
              ))
            ) : (
              <EmptyList message="Ask your first question to get started" />
            )}
          </div>

          <AIPromptForm
            onSubmit={onSubmit}
            isGlobalLoading={isGlobalLoading}
            placeholder={inputPlaceholder}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col rounded-xl border border-border/40 bg-background/70 p-4 md:col-span-8 md:h-full md:overflow-y-auto">
        {activeQuery ? (
          <div className="flex flex-col gap-4">{renderQuery(activeQuery)}</div>
        ) : (
          <Empty className="gap-2 py-12">
            <EmptyMedia>
              <Sparkles className="size-6" />
            </EmptyMedia>
            <EmptyContent>Ask a question to see results here</EmptyContent>
          </Empty>
        )}
      </div>
    </div>
  );
}
