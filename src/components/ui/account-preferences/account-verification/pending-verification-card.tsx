import EFCard from "@/components/shared/molecules/ef-card";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock } from "lucide-react";

const PendingVerificationCard: React.FC = () => {
  return (
    <EFCard
      rootClassName={cn(
        "border border-warning",
        "bg-warning/10",
        "dark:bg-warning-foreground/10"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[auto_1fr] items-center gap-4">
          <div className="relative">
            <Clock className="text-warning-foreground dark:text-warning size-6 sm:size-7" />
            <div className="absolute -top-1 -right-1 size-3 bg-warning-foreground dark:bg-warning rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-warning-foreground dark:text-warning font-semibold text-base sm:text-lg">
              Verification In Progress
            </h4>
            <Paragraph className="text-warning-foreground/80 dark:text-warning/80 text-sm">
              Your account verification is currently under review
            </Paragraph>
          </div>
        </div>

        <div className="ml-10 sm:ml-11 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-warning-foreground dark:text-warning mt-0.5 shrink-0" />
            <Paragraph className="text-warning-foreground/90 dark:text-warning/90 text-sm">
              Documents received and under verification
            </Paragraph>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-warning-foreground dark:text-warning mt-0.5 shrink-0" />
            <Paragraph className="text-warning-foreground/90 dark:text-warning/90 text-sm">
              Estimated processing time: 2-3 business days
            </Paragraph>
          </div>
        </div>

        <div className="ml-10 sm:ml-11 pt-2 border-t border-warning-foreground/20 dark:border-warning/20">
          <Paragraph className="text-warning-foreground/75 dark:text-warning/75 text-xs sm:text-sm">
            You&apos;ll receive a notification once your verification is
            complete. If you have any questions, please contact our support
            team.
          </Paragraph>
        </div>
      </div>
    </EFCard>
  );
};

export default PendingVerificationCard;
