import AdminSectionCardLayout from "@/components/shared/layouts/admin-section-card-layout";
import HostVerificationReviewTable from "@/components/ui/host-verification-review-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Host approvals",
  description: "Host approvals"
};

export default function HostApprovalPage() {
  return (
    <AdminSectionCardLayout
      title="Host verifications"
      description="Approve, rejects all the pending host verification requests"
    >
      <HostVerificationReviewTable />
    </AdminSectionCardLayout>
  );
}
