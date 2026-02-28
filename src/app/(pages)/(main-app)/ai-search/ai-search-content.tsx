"use client";

import { InputField } from "@/components/shared/molecules/form";
import { Spinner } from "@/components/shared/shadcn-components/spinner";
import { TypographyMuted } from "@/components/shared/shadcn-components/typography";
import { AIEventListResult } from "@/components/ui/ai-event-list/ai-event-list-result";
import AIRepository from "@/repositories/ai.repository";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { PromtScheam } from "../../../../../common/validation-schemas";

export const AISearchResultContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPrompt = searchParams.get("prompt") || "";

  const form = useForm({
    defaultValues: {
      prompt: initialPrompt
    },
    resolver: zodResolver(PromtScheam)
  });

  const { data, isLoading } = useQuery({
    queryKey: ["ai-search", initialPrompt],
    queryFn: () => AIRepository.executePrompt({ prompt: initialPrompt }),
    enabled: !!initialPrompt,
    staleTime: Infinity
  });

  const result = data?.result;
  // const result = {
  //   message: "Here are the events for you",
  //   events: [
  //     {
  //       _id: "69a30c741266286e0f15452c",
  //       title: "Beach Party Weekend",
  //       description: "Enjoy the sun, sand, and surf at our annual beach bash.",
  //       placeName: "Cox's Bazar, Bangladesh",
  //       eventDate: "2026-04-10T14:00:00.000Z",
  //       entryFee: 50,
  //       dayCount: 2,
  //       nightCount: 1,
  //       memberCapacity: 50,
  //       status: "open",
  //       createdAt: "2026-02-28T15:40:36.866Z",
  //       updatedAt: "2026-02-28T15:40:36.866Z"
  //     },
  //     {
  //       _id: "69a30c751266286e0f154532",
  //       title: "Serene Tea Garden Retreat",
  //       description:
  //         "Relax and rejuvenate amidst the rolling hills of tea gardens.",
  //       placeName: "Srimangal, Bangladesh",
  //       eventDate: "2026-06-12T10:00:00.000Z",
  //       entryFee: 100,
  //       dayCount: 2,
  //       nightCount: 1,
  //       memberCapacity: 15,
  //       status: "open",
  //       createdAt: "2026-02-28T15:40:37.277Z",
  //       updatedAt: "2026-02-28T15:40:37.277Z"
  //     },
  //     {
  //       _id: "69a30c761266286e0f154540",
  //       title: "Winter Camping Night",
  //       description: "Cozy up by the fire and sleep under the stars.",
  //       placeName: "Bandarban, Bangladesh",
  //       eventDate: "2026-12-20T16:00:00.000Z",
  //       entryFee: 8000,
  //       dayCount: 2,
  //       nightCount: 1,
  //       memberCapacity: 20,
  //       status: "open",
  //       createdAt: "2026-02-28T15:40:38.303Z",
  //       updatedAt: "2026-02-28T18:09:16.052Z"
  //     }
  //   ]
  // };

  const onSubmit = (values: { prompt: string }) => {
    const params = new URLSearchParams();
    params.set("prompt", values.prompt);
    router.push(`/ai-search?${params.toString()}`);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6">
      <div className="flex-1 overflow-y-auto flex flex-col gap-4">
        {result ? (
          <AIEventListResult message={result.message} events={result.events} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <TypographyMuted>Ask AI to find events for you</TypographyMuted>
          </div>
        )}
      </div>

      <div className="magic-glow group shrink-0">
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <InputField
            name="prompt"
            control={form.control}
            disabled={isLoading}
            placeholder="Where do you want to go next? Ask AI..."
            className="h-16 rounded-full px-8 bg-background/60 backdrop-blur-2xl border-primary/20 focus:border-primary transition-all text-xl shadow-2xl w-full pr-20"
          />
          <button
            type="submit"
            className="absolute right-3 top-2 bottom-2 aspect-square bg-primary disabled:bg-primary/60 text-primary-foreground rounded-full flex items-center justify-center not-disabled:hover:scale-105 transition-transform shadow-lg shadow-primary/20 disabled:cursor-not-allowed cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
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
