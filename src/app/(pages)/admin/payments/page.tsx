import AdminSectionCardLayout from "@/components/shared/layouts/admin-section-card-layout";
import AdminPaymentsMonitor from "@/components/ui/admin-payments-monitor/admin-payments-monitor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments",
  description: "Monitor payment performance and transactions"
};

export default function AdminPaymentsPage() {
  return (
    <AdminSectionCardLayout
      title="Payments"
      description="See overall payment stats and the latest transactions across the platform."
    >
      <AdminPaymentsMonitor />
    </AdminSectionCardLayout>
  );
}
