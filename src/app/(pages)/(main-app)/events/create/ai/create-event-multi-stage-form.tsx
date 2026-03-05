"use client";

import { InputField } from "@/components/shared/molecules/form";
import TMCard from "@/components/shared/molecules/tm-card";
import Form from "@/components/shared/organisms/form";
import { Button } from "@/components/shared/shadcn-components/button";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import {
  MultiStageFormHeader,
  PAGE_STAGE,
  TPageStage
} from "@/components/ui/create-event-page/multi-stage-form-header";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { TCreateEventForm } from "../../../../../../../common/types";
import { AiEventCreationSchema } from "../../../../../../../common/validation-schemas";
import CreateEventForm from "../create-event-form";

type TStageData = z.infer<typeof AiEventCreationSchema>;

export const CreateEventMultiStageForm: React.FC = () => {
  const router = useRouter();

  const [stage, setStage] = useState<TPageStage>(PAGE_STAGE.AI_INPUT);
  const [aiGeneratedData, setAiGeneratedData] =
    useState<Partial<TCreateEventForm> | null>(null);

  const form = useForm<TStageData>({
    resolver: zodResolver(AiEventCreationSchema),
    defaultValues: {
      place: "",
      when: "",
      back: ""
    }
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: TStageData) => {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const startDate = new Date(data.when);
    const endDate = new Date(data.back);
    const diffInMs = endDate.getTime() - startDate.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    const dayCount = Math.max(1, diffInDays);
    const nightCount = Math.max(0, diffInDays - 1);

    const mockData: Partial<TCreateEventForm> = {
      title: `Adventure in ${data.place}`,
      placeName: data.place,
      description: `A wonderful trip to ${data.place} from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}. This AI-generated event aims to provide a memorable experience for all participants.`,
      eventDate: data.when as any,
      dayCount: dayCount,
      nightCount: nightCount,
      entryFee: 5000,
      memberCapacity: 20,
      itinerary: Array.from({ length: dayCount }).map((_, i) => ({
        moment: new Date(
          startDate.getTime() + i * 24 * 60 * 60 * 1000
        ).toISOString(),
        title: `Day ${i + 1} Exploration`,
        description: `Exciting activities planned for day ${i + 1} in ${data.place}.`
      }))
    };

    setAiGeneratedData(mockData);
    setStage(PAGE_STAGE.USER_INPUT);
  };

  return (
    <div>
      <Button
        variant="link"
        className="text-primary-foreground hover:no-underline! p-0"
        disabled={form.formState.isSubmitting}
        onClick={() =>
          stage === PAGE_STAGE.AI_INPUT
            ? router.back()
            : setStage(PAGE_STAGE.AI_INPUT)
        }
      >
        <Paragraph className="text-sm flex gap-2 items-center">
          <ArrowLeft className="size-4" />
          Back to home
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
          <TMCard
            title="Create with AI"
            rootClassName="overflow-hidden border-none shadow-xl bg-gradient-to-br from-background to-muted/30"
          >
            <Form
              form={form}
              validationSchema={AiEventCreationSchema}
              onSubmitCallback={onSubmit}
              render={(control) => (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <InputField
                        label="Where do you want to go?"
                        name="place"
                        placeholder="e.g. Cox's Bazar, Sundarbans, etc."
                        control={control}
                        disabled={isSubmitting}
                      />
                    </div>
                    <InputField
                      label="When do you want to go?"
                      name="when"
                      type="datetime-local"
                      control={control}
                      disabled={isSubmitting}
                    />
                    <InputField
                      label="When do you want to come back?"
                      name="back"
                      type="datetime-local"
                      control={control}
                      placeholder="Return date and time"
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-[1.01] active:scale-[1] group shadow-lg shadow-primary/20"
                  >
                    Generate Event Plan
                    {!isSubmitting && (
                      <Sparkles className="ml-2 size-5 group-hover:rotate-180 transition-transform duration-400" />
                    )}
                  </Button>
                </div>
              )}
            />
          </TMCard>
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
            <CreateEventForm initialData={aiGeneratedData} />
          </div>
        )}
      </div>
    </div>
  );
};
