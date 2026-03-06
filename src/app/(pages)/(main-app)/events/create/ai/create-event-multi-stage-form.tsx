"use client";

import { AISearchResultContent } from "@/components/shared/organisms/ai-search-result-content";
import { Button } from "@/components/shared/shadcn-components/button";
import { Card, CardContent } from "@/components/shared/shadcn-components/card";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import {
  MultiStageFormHeader,
  PAGE_STAGE,
  TPageStage
} from "@/components/ui/create-event-page/multi-stage-form-header";
import { cn } from "@/lib/utils";
import AIRepository from "@/repositories/ai.repository";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import React, { useState } from "react";
import { toast } from "sonner";
import { TCreateEventForm } from "../../../../../../../common/types";
import { TGenerateEventPlanResponse } from "../../../../../../../common/types/ai.types";
import { CreateEventForm } from "../create-event-form";
import { AIEventPlanQuerySection } from "./ai-event-plan-query-section";

export const CreateEventMultiStageForm: React.FC = () => {
  const router = useRouter();

  const [stage, setStage] = useState<TPageStage>(PAGE_STAGE.AI_INPUT);
  const [aiGeneratedData, setAiGeneratedData] =
    useState<Partial<TCreateEventForm> | null>(null);

  const executeSearch = async (prompt: string) => {
    const { result } = await AIRepository.generateEventPlan({
      prompt
    });
    return result;
  };

  const onError = (error: any) => {
    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to generate event plan"
    );
  };

  const onBack = () => {
    if (stage === PAGE_STAGE.AI_INPUT) {
      router.back();
      return;
    }
    setStage(PAGE_STAGE.AI_INPUT);
  };

  return (
    <div>
      <Button
        variant="link"
        className="text-primary-foreground hover:no-underline! p-0"
        onClick={onBack}
      >
        <Paragraph className="text-sm flex gap-2 items-center p-0!">
          <ArrowLeft className="size-4" />
          Back
        </Paragraph>
      </Button>
      <div
        className={cn(
          "py-10 mx-auto! w-full flex flex-col gap-6 sm:gap-10",
          stage === PAGE_STAGE.AI_INPUT ? "max-w-4xl" : ""
        )}
      >
        <MultiStageFormHeader currentStage={stage} />

        {stage === PAGE_STAGE.AI_INPUT && (
          <Card className="overflow-hidden border-none shadow-xl bg-linear-to-br from-background to-muted/30">
            <CardContent className="h-[50vh]">
              <AISearchResultContent<TGenerateEventPlanResponse>
                className="h-full"
                executeSearch={executeSearch}
                onError={onError}
                inputPlaceholder="Describe the event you want to create"
                renderQuery={({ key, ...query }) => (
                  <AIEventPlanQuerySection
                    id={key}
                    prompt={query.prompt}
                    isLoading={query.isLoading}
                    result={query.result}
                    onNext={(result) => {
                      setAiGeneratedData(result);
                      setStage(PAGE_STAGE.USER_INPUT);
                    }}
                  />
                )}
              />
            </CardContent>
          </Card>
        )}

        {stage === PAGE_STAGE.USER_INPUT && aiGeneratedData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-6">
            <div className="mb-6 bg-primary/10 border border-primary/20 p-4 rounded-lg flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <Paragraph className="font-medium text-primary">
                AI has generated a plan for you! Please review and finalize the
                details below.
              </Paragraph>
            </div>
            <CreateEventForm initialData={aiGeneratedData} onCancel={onBack} />
          </div>
        )}
      </div>
    </div>
  );
};
