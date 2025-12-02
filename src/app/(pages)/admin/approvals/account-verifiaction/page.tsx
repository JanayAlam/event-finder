import {
  H2,
  H3,
  Paragraph
} from "@/components/shared/shadcn-components/typography";
import { Metadata } from "next";
import PendingReviewsTable from "./PendingReviewsTable";

export const metadata: Metadata = {
  title: "Account verification approvals",
  description: "Account verification approvals"
};

export default function AccountVerificationPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div>
          <H2 className="hidden xl:block">Account verifications</H2>
          <H3 className="xl:hidden">Account verifications</H3>
        </div>
        <Paragraph>
          Approve, declines all the pending account verifiaction requests
        </Paragraph>
      </div>

      <PendingReviewsTable />
    </div>
  );
}
