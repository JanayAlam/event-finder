"use client";

import { EmptyList } from "@/components/shared/molecules/empty";
import { PageLoader } from "@/components/shared/molecules/page-loader";
import { TablePagination } from "@/components/shared/organisms/data-table/table-pagination";
import { PaymentsTable } from "@/components/shared/organisms/payments";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/shared/shadcn-components/card";
import AdminRepository from "@/repositories/admin.repository";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { TPaymentResponseDto } from "../../../../common/types";

export default function AdminPaymentsMonitor() {
  const [page, setPage] = useState(1);

  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["admin-payment-stats"],
    queryFn: () => AdminRepository.getPaymentStats()
  });

  const { data, isLoading: isPaymentsLoading } = useQuery({
    queryKey: ["admin-payments", page],
    queryFn: () => AdminRepository.getPayments({ page, limit: 10 })
  });

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / 10));
  const payments = useMemo(() => data?.payments ?? [], [data]);
  const tableData = useMemo<TPaymentResponseDto[]>(
    () =>
      payments.map((payment) => ({
        _id: payment._id,
        amount: payment.amount,
        tranId: payment.tranId,
        status: payment.status,
        createdAt: payment.createdAt,
        updatedAt: payment.createdAt,
        user: {
          _id: payment.user._id.toString(),
          email: payment.user.email,
          profile: payment.user.profile
            ? {
                _id: payment.user.profile._id,
                firstName: payment.user.profile.firstName,
                lastName: payment.user.profile.lastName
              }
            : null
        },
        event: {
          _id: payment.event._id.toString(),
          title: payment.event.title
        }
      })),
    [payments]
  );

  if (isStatsLoading || isPaymentsLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Successful Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {stats?.successfulPayments.toLocaleString() ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Collected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              BDT {stats?.totalCollected.toLocaleString() ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Failed Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {stats?.failedPayments.toLocaleString() ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {!payments.length ? (
        <EmptyList message="No payment records found" />
      ) : (
        <PaymentsTable data={tableData} showPayer showEvent />
      )}

      <TablePagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={isPaymentsLoading}
      />
    </div>
  );
}
