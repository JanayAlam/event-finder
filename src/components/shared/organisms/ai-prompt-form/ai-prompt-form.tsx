"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { TPromtRequestDto } from "../../../../../common/types/ai.types";
import { PromtScheam } from "../../../../../common/validation-schemas";
import { InputField } from "../../molecules/form";
import { Spinner } from "../../shadcn-components/spinner";

interface IAIPromptFormProps {
  onSubmit: (values: TPromtRequestDto) => void;
  isGlobalLoading: boolean;
}

export const AIPromptForm: React.FC<IAIPromptFormProps> = ({
  onSubmit,
  isGlobalLoading
}) => {
  const form = useForm({
    defaultValues: {
      prompt: ""
    },
    resolver: zodResolver(PromtScheam)
  });

  const handleSubmit = (values: TPromtRequestDto) => {
    onSubmit(values);
    form.reset({ prompt: "" });
  };

  return (
    <div className="magic-glow group shrink-0">
      <form onSubmit={form.handleSubmit(handleSubmit)} className="relative">
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
  );
};
