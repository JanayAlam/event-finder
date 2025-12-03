"use client";

import {
  DataTable,
  useDataTable
} from "@/components/shared/organisms/data-table";
import { Spinner } from "@/components/shared/shadcn-components/spinner";
import AccountVerificationRepository from "@/repositories/account-verification.repository";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { createColumns } from "./columns";

export default function AccountVerificationReviewTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["get-pending-reviews"],
    queryFn: () => AccountVerificationRepository.pendingReviews()
  });

  const columns = createColumns({
    onView(accountVerificationId) {},
    onAccept(accountVerificationId) {},
    onDecline(accountVerificationId) {}
  });

  const { table } = useDataTable({
    columns,
    data:
      data?.map((item) => ({
        accountVerificationId: item._id.toString(),
        name: `${item.user.profile?.firstName ?? ""} ${item.user.profile?.lastName ?? ""}`,
        email: item.user.email,
        requestedAt: dayjs(item.createdAt).format("DD/MM/YYYY")
      })) ?? []
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center space-y-10">
        <Spinner />
      </div>
    );
  }

  return <DataTable containerClassName="w-full" table={table} />;
}
