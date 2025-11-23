import Card from "@/components/shared/molecules/card";
import { Paragraph } from "@/components/shared/shadcn-components/typography";
import { cn } from "@/utils/tailwind-utils";
import { BadgeInfo } from "lucide-react";
import VerificationTabs from "./verification-tabs";

export const metadata = {
  title: "Verification",
  description: "Account verification data"
};

const VerificationPage = () => {
  return (
    <Card
      title="Verification"
      description="Update and verify your identity documents to keep your account secure."
    >
      <div className="flex flex-col gap-4">
        <Card
          rootClassName={cn(
            "border border-brand-primary-light-1",
            "bg-brand-primary-light-2",
            "dark:border-brand-primary-light-2",
            "dark:bg-brand-primary-light-2",
            "sm:px-4 sm:py-4"
          )}
        >
          <div className="grid grid-cols-[auto_1fr] items-center gap-4">
            <BadgeInfo className="text-brand-primary-main size-6 sm:size-7" />
            <Paragraph className="text-brand-primary-main">
              You can verify your account by providing either your NID or your
              passport
            </Paragraph>
          </div>
        </Card>

        <VerificationTabs />
      </div>
    </Card>
  );
};

export default VerificationPage;
