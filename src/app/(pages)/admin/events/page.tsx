import AdminSectionCardLayout from "@/components/shared/layouts/admin-section-card-layout";
import AdminEventsMonitor from "@/components/ui/admin-events-monitor/admin-events-monitor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Monitor all events"
};

export default function EventMonitorPage() {
  return (
    <AdminSectionCardLayout
      title="Events"
      description="View and manage all created events, their payment status, etc."
    >
      <AdminEventsMonitor />
    </AdminSectionCardLayout>
  );
}
