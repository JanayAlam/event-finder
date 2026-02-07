import TMCard from "@/components/shared/molecules/tm-card";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

const VerifiedCard: React.FC = () => {
  return (
    <TMCard
      rootClassName={cn(
        "border border-success",
        "bg-success/10",
        "dark:bg-success-foreground/10"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[auto_1fr] items-center gap-4">
          <div className="relative">
            <CheckCircle2 className="text-success dark:text-success size-6 sm:size-7" />
            <div className="absolute -bottom-1 -right-1 size-3 bg-success dark:bg-success rounded-full" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-success dark:text-success font-semibold text-base sm:text-lg">
              Account Verified
            </h4>
            <Paragraph className="text-success/80 dark:text-success/80 text-sm">
              Your account has been successfully verified
            </Paragraph>
          </div>
        </div>

        <div className="ml-10 sm:ml-11 flex flex-col gap-3">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="size-4 text-success dark:text-success mt-0.5 shrink-0" />
            <Paragraph className="text-success/90 dark:text-success/90 text-sm">
              All documents have been approved
            </Paragraph>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="size-4 text-success dark:text-success mt-0.5 shrink-0" />
            <Paragraph className="text-success/90 dark:text-success/90 text-sm">
              Full account access enabled
            </Paragraph>
          </div>
        </div>

        <div className="ml-10 sm:ml-11 pt-2 border-t border-success/20 dark:border-success/20">
          <Paragraph className="text-success/75 dark:text-success/75 text-xs sm:text-sm">
            Thank you for completing the verification process. You now have
            access to all features.
          </Paragraph>
        </div>
      </div>
    </TMCard>
  );
};

export default VerifiedCard;
