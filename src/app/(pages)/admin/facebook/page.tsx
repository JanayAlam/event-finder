import AdminSectionCardLayout from "@/components/shared/layouts/admin-section-card-layout";
import FacebookIntegrationCard from "@/components/ui/facebook-integration-card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Facebook Integration",
  description: "Connect and manage your Facebook Page integration"
};

export default function FacebookManagementPage() {
  return (
    <AdminSectionCardLayout
      title="Facebook integration"
      description="Connect your facebook account to Event Finder to enable automatic posting of your events to your facebook page."
    >
      <FacebookIntegrationCard />
    </AdminSectionCardLayout>
  );
}
