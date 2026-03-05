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
import { BadgeQuestionMark, Sparkles } from "lucide-react";
import React from "react";
import { TGenerateEventPlanResponse } from "../../../../../../../common/types/ai.types";

interface IAIEventPlanQuerySectionProps {
  id: string;
  prompt: string;
  isLoading: boolean;
  result?: TGenerateEventPlanResponse;
  onNext: (result: TGenerateEventPlanResponse) => void;
}

export const AIEventPlanQuerySection: React.FC<IAIEventPlanQuerySectionProps> = ({
  id,
  prompt,
  isLoading,
  result,
  onNext
}) => {
  return (
    <div id={id} className="flex flex-col gap-4 w-full">
      <H4 className="flex items-center gap-2 flex-wrap">
        <BadgeQuestionMark className="size-6" />
        {prompt}
      </H4>
      <Separator />

      {isLoading ? (
        <PageLoader />
      ) : !result ? (
        <TypographyMuted>No generated plan found</TypographyMuted>
      ) : (
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="size-5 text-primary" />
              {result.title}
            </CardTitle>
            <TypographyMuted>{result.placeName}</TypographyMuted>
          </CardHeader>
          <CardContent className="space-y-4">
            <Paragraph>{result.description}</Paragraph>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium">Start:</span>{" "}
                {dayjs(result.eventDate).format("MMM D, YYYY h:mm A")}
              </div>
              <div>
                <span className="font-medium">Duration:</span> {result.dayCount}{" "}
                day(s), {result.nightCount} night(s)
              </div>
              <div>
                <span className="font-medium">Entry Fee:</span> BDT{" "}
                {result.entryFee}
              </div>
              <div>
                <span className="font-medium">Capacity:</span>{" "}
                {result.memberCapacity}
              </div>
            </div>

            <div className="space-y-2">
              <Paragraph className="font-medium">Itinerary</Paragraph>
              <div className="space-y-2">
                {result.itinerary.map((item, index) => (
                  <div
                    key={`${item.moment}-${index}`}
                    className="rounded-md border p-3"
                  >
                    <Paragraph className="font-medium">{item.title}</Paragraph>
                    <TypographyMuted>
                      {dayjs(item.moment).format("MMM D, YYYY h:mm A")}
                    </TypographyMuted>
                    <Paragraph className="mt-1">{item.description}</Paragraph>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button onClick={() => onNext(result)} className="w-full sm:w-auto">
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
