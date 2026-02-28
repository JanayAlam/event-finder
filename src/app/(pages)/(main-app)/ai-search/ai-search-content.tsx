"use client";

import { InputField } from "@/components/shared/molecules/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { PromtScheam } from "../../../../../common/validation-schemas";

export const AISearchResultContent = () => {
  const searchParams = useSearchParams();

  const form = useForm({
    defaultValues: {
      prompt: ""
    },
    resolver: zodResolver(PromtScheam)
  });

  const prompt = searchParams.get("prompt") || "";

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6">
      <div className="flex-1 overflow-y-auto">{prompt}</div>

      <div className="magic-glow group shrink-0">
        <InputField
          control={form.control}
          name="prompt"
          className="h-14 rounded-full px-8 bg-background/80 backdrop-blur-xl border-primary/20 focus:border-primary transition-all text-lg shadow-2xl w-full"
          placeholder="Refine your magic search, ask AI..."
        />
      </div>
    </div>
  );
};
