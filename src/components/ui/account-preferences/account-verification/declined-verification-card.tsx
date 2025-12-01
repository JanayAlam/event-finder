import Card from "@/components/shared/molecules/card";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import { cn } from "@/utils/tailwind-utils";
import { AlertCircle, RefreshCw, XCircle } from "lucide-react";

const DeclinedVerificationCard: React.FC = () => {
  return (
    <Card
      rootClassName={cn(
        "border border-destructive",
        "bg-destructive/10",
        "dark:bg-destructive-foreground/10",
        "sm:px-4 sm:py-4"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[auto_1fr] items-start gap-4">
          <div className="relative">
            <XCircle className="text-destructive dark:text-destructive size-6 sm:size-7" />
            <div className="absolute -bottom-1 -right-1 size-3 bg-destructive dark:bg-destructive rounded-full" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-destructive dark:text-destructive font-semibold text-base sm:text-lg">
              Verification Declined
            </h4>
            <Paragraph className="text-destructive/80 dark:text-destructive/80 text-sm">
              Your account verification could not be completed
            </Paragraph>
          </div>
        </div>

        <div className="ml-10 sm:ml-11 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 text-destructive dark:text-destructive mt-0.5 shrink-0" />
            <Paragraph className="text-destructive/90 dark:text-destructive/90 text-sm">
              Documents did not meet verification requirements
            </Paragraph>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="size-4 text-destructive dark:text-destructive mt-0.5 shrink-0" />
            <Paragraph className="text-destructive/90 dark:text-destructive/90 text-sm">
              You can resubmit with updated documents
            </Paragraph>
          </div>
        </div>

        <div className="ml-10 sm:ml-11 pt-2 border-t border-destructive-foreground/20 dark:border-destructive/20">
          <Paragraph className="text-destructive/75 dark:text-destructive/75 text-xs sm:text-sm">
            Please ensure your documents are clear, valid, and match your
            account information before resubmitting.
          </Paragraph>
        </div>
      </div>
    </Card>
  );
};

export default DeclinedVerificationCard;
