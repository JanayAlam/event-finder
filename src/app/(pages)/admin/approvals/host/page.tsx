import {
  H2,
  H3,
  Paragraph
} from "@/components/shared/shadcn-components/typography";
import HostVerificationReviewTable from "@/components/ui/host-verification-review-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Host approvals",
  description: "Host approvals"
};

export default function HostApprovalPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div>
          <H2 className="hidden xl:block">Host verifications</H2>
          <H3 className="xl:hidden">Host verifications</H3>
        </div>
        <Paragraph>
          Approve, declines all the pending host verification requests
        </Paragraph>
      </div>

      <HostVerificationReviewTable />
    </div>
  );
}
