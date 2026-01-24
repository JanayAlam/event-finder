import {
  H2,
  H3,
  Paragraph
} from "@/components/shared/shadcn-components/typography";
import FacebookIntegrationCard from "@/components/ui/facebook-integration-card/FacebookIntegrationCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Facebook Integration",
  description: "Connect and manage your Facebook Page integration"
};

export default function FacebookManagementPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div>
          <H2 className="hidden xl:block">Facebook Integration</H2>
          <H3 className="xl:hidden">Facebook Integration</H3>
        </div>
        <Paragraph>
          Connect your facebook account to TripMate to enable automatic posting
          of your events to your facebook page.
        </Paragraph>
      </div>

      <FacebookIntegrationCard />
    </div>
  );
}
