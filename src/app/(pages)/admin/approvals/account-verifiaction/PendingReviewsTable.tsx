"use client";

import { DataTable } from "@/components/shared/organisms/data-table/DataTable";
import AccountVerificationRepository from "@/repositories/account-verification.repository";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React from "react";
import { columns } from "./columns";

const PendingReviewsTable: React.FC = () => {
  const { data } = useQuery({
    queryKey: ["get-pending-reviews"],
    queryFn: () => AccountVerificationRepository.pendingReviews()
  });

  return (
    <DataTable
      columns={columns}
      data={
        data?.map((a) => ({
          name: `${a.user.profile?.firstName} ${a.user.profile?.lastName}`,
          email: a.user.email,
          createdAt: dayjs(a.createdAt).format("DD-MM-YYYY")
        })) ?? []
      }
    />
  );
};

export default PendingReviewsTable;
