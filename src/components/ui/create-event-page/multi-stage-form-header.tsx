import { Paragraph } from "@/components/shared/shadcn-components/typography";
import { cn } from "@/lib/utils";
import { CheckCircle2, Sparkles } from "lucide-react";
import React from "react";

export const PAGE_STAGE = {
  AI_INPUT: "ai_input",
  USER_INPUT: "user_input"
} as const;

export type TPageStage = (typeof PAGE_STAGE)[keyof typeof PAGE_STAGE];

interface MultiStageFormHeaderProps {
  currentStage: TPageStage;
}

export const MultiStageFormHeader: React.FC<MultiStageFormHeaderProps> = ({
  currentStage
}) => {
  const steps = [
    {
      id: PAGE_STAGE.AI_INPUT,
      label: "Your Preferences",
      icon: <Sparkles className="size-6" />
    },
    {
      id: PAGE_STAGE.USER_INPUT,
      label: "Verify",
      icon: <CheckCircle2 className="size-6" />
    }
  ];

  return (
    <div className="w-full flex items-center justify-around max-w-lg mx-auto!">
      {steps.map((step, idx) => {
        const isActive = currentStage === step.id;
        const isCompleted = steps.findIndex((s) => s.id === currentStage) > idx;

        return (
          <div key={step.id} className="flex flex-col items-center gap-2.5">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                  : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? <CheckCircle2 className="size-6" /> : step.icon}
            </div>
            <Paragraph
              className={cn(
                "text-sm font-semibold",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {step.label}
            </Paragraph>
          </div>
        );
      })}
    </div>
  );
};
