import AdminSectionCardLayout from "@/components/shared/layouts/AdminSectionCardLayout";
import FacebookIntegrationCard from "@/components/ui/facebook-integration-card/FacebookIntegrationCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Facebook Integration",
  description: "Connect and manage your Facebook Page integration"
};

export default function FacebookManagementPage() {
  return (
    <AdminSectionCardLayout
      title="Facebook integration"
      description="Connect your facebook account to TripMate to enable automatic posting of your events to your facebook page."
    >
      <FacebookIntegrationCard />
    </AdminSectionCardLayout>
  );
}
