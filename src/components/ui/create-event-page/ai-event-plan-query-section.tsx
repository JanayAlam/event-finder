"use client";

import { PageLoader } from "@/components/shared/molecules/page-loader";
import { Button } from "@/components/shared/shadcn-components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/shared/shadcn-components/card";
import { Separator } from "@/components/shared/shadcn-components/separator";
import {
  H4,
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import dayjs from "dayjs";
import { BadgeQuestionMark, ChevronRight, Sparkles } from "lucide-react";
import React from "react";
import { TGenerateEventPlanResponse } from "../../../../common/types/ai.types";

interface IAIEventPlanQuerySectionProps {
  id: string;
  prompt: string;
  isLoading: boolean;
  result?: TGenerateEventPlanResponse;
  showQuestion?: boolean;
  onNext: (result: TGenerateEventPlanResponse) => void;
}

export const AIEventPlanQuerySection: React.FC<
  IAIEventPlanQuerySectionProps
> = ({ id, prompt, isLoading, result, showQuestion = true, onNext }) => {
  return (
    <div id={id} className="flex flex-col gap-4 w-full">
      {showQuestion ? (
        <>
          <H4 className="flex items-center gap-2 flex-wrap">
            <BadgeQuestionMark className="size-6" />
            {prompt}
          </H4>
          <Separator />
        </>
      ) : null}

      {isLoading ? (
        <PageLoader />
      ) : !result ? (
        <TypographyMuted>No generated plan found</TypographyMuted>
      ) : (
        <div className="flex flex-col gap-4">
          <Paragraph className="px-1.5">{result.message}</Paragraph>
          <Card className="w-full">
            <CardHeader className="flex flex-col gap-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="size-5 text-primary" />
                {result.eventToCreate.title}
              </CardTitle>
              <TypographyMuted className="text-sm">
                {result.eventToCreate.placeName}
              </TypographyMuted>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Paragraph className="text-sm leading-5">
                {result.eventToCreate.description}
              </Paragraph>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-primary">Start Date:</span>{" "}
                  {dayjs(result.eventToCreate.eventDate).format(
                    "MMM D, YYYY h:mm A"
                  )}
                </div>
                <div>
                  <span className="font-medium text-primary">Duration:</span>{" "}
                  {result.eventToCreate.dayCount} day(s),{" "}
                  {result.eventToCreate.nightCount} night(s)
                </div>
                <div>
                  <span className="font-medium text-primary">Entry Fee:</span>{" "}
                  BDT {result.eventToCreate.entryFee}
                </div>
                <div>
                  <span className="font-medium text-primary">Capacity:</span>{" "}
                  {result.eventToCreate.memberCapacity}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Paragraph className="font-medium">Itinerary</Paragraph>
                <div className="flex flex-col gap-2">
                  {result.eventToCreate.itinerary.map((item, index) => (
                    <div
                      key={`${item.moment}-${index}`}
                      className="rounded-md border p-4 flex flex-col gap-3"
                    >
                      <div>
                        <Paragraph className="font-medium text-primary">
                          {item.title}
                        </Paragraph>
                        <TypographyMuted className="text-xs">
                          {dayjs(item.moment).format("MMM D, YYYY h:mm A")}
                        </TypographyMuted>
                      </div>
                      <Paragraph className="text-sm">
                        {item.description}
                      </Paragraph>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => onNext(result)}
                  className="w-full sm:w-auto gap-1"
                >
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
