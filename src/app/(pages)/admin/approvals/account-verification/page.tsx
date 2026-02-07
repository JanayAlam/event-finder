import AdminSectionCardLayout from "@/components/shared/layouts/admin-section-card-layout";
import AccountVerificationReviewTable from "@/components/ui/account-verification-review-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account verification approvals",
  description: "Account verification approvals"
};

export default function AccountVerificationPage() {
  return (
    <AdminSectionCardLayout
      title="Account verifications"
      description="Approve, declines all the pending account verification requests"
    >
      <AccountVerificationReviewTable />
    </AdminSectionCardLayout>
  );
}
