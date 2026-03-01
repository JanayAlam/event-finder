"use client";

import { InputField } from "@/components/shared/molecules/form";
import { Spinner } from "@/components/shared/shadcn-components/spinner";
import AIRepository from "@/repositories/ai.repository";
import { PUBLIC_PAGE_ROUTE } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  IAIQueryItem,
  TPromtRequestDto
} from "../../../../../common/types/ai.types";
import { PromtScheam } from "../../../../../common/validation-schemas";
import { AIQuerySection } from "./ai-query-section";

const generateKey = () => dayjs().valueOf().toString();

export const AISearchResultContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPrompt = searchParams.get("prompt") || "";

  const scrollRef = useRef<HTMLDivElement>(null);

  const [queries, setQueries] = useState<IAIQueryItem[]>([]);

  const form = useForm({
    defaultValues: {
      prompt: ""
    },
    resolver: zodResolver(PromtScheam)
  });

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

  const onSubmit = (values: TPromtRequestDto) => {
    const key = generateKey();
    setQueries((prev) => [
      ...prev,
      { prompt: values.prompt, key, isLoading: true }
    ]);
    executeSearch(values.prompt, key);
    form.reset({ prompt: "" });
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

      <div className="magic-glow group shrink-0">
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <InputField
            name="prompt"
            control={form.control}
            disabled={isGlobalLoading}
            placeholder="Where do you want to go next? Ask AI..."
            className="h-16 rounded-full px-8 bg-background/60 backdrop-blur-2xl border-primary/20 focus:border-primary transition-all text-xl shadow-2xl w-full pr-20"
          />
          <button
            type="submit"
            className="absolute right-3 top-2 bottom-2 aspect-square bg-primary disabled:bg-primary/60 text-primary-foreground rounded-full flex items-center justify-center not-disabled:hover:scale-105 transition-transform shadow-lg shadow-primary/20 disabled:cursor-not-allowed cursor-pointer"
            disabled={isGlobalLoading}
          >
            {isGlobalLoading ? (
              <Spinner className="size-6" color="text-white!" />
            ) : (
              <Sparkles className="size-6 fill-current" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
