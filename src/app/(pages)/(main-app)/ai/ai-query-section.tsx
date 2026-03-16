"use client";

import { PageLoader } from "@/components/shared/molecules/page-loader";
import { Separator } from "@/components/shared/shadcn-components/separator";
import {
  H4,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { AIEventListResult } from "@/components/ui/ai-query-page";
import { BadgeQuestionMark } from "lucide-react";
import React from "react";
import { TAISearchEventResponse } from "../../../../../common/types/ai.types";

interface IAIQuerySectionProps {
  id: string;
  prompt: string;
  isLoading: boolean;
  showQuestion?: boolean;
  result?: TAISearchEventResponse;
}

export const AIQuerySection: React.FC<IAIQuerySectionProps> = ({
  id,
  prompt,
  isLoading,
  showQuestion = true,
  result
}) => {
  return (
    <div id={id} className="flex flex-col gap-6">
      {showQuestion ? (
        <div className="flex flex-col gap-2">
          <H4 className="flex items-center gap-2 flex-wrap">
            <BadgeQuestionMark className="size-6" />
            {prompt}
          </H4>
          <Separator />
        </div>
      ) : null}
      {isLoading ? (
        <PageLoader />
      ) : !result ? (
        <TypographyMuted>No result found</TypographyMuted>
      ) : (
        <AIEventListResult message={result.message} events={result.events} />
      )}
    </div>
  );
};
