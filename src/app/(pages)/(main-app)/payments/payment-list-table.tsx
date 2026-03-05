"use client";

import { EmptyList } from "@/components/shared/molecules/empty";
import { PaymentsTable } from "@/components/shared/organisms/payments";
import { Spinner } from "@/components/shared/shadcn-components/spinner";
import {
  H4,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import PaymentRepository from "@/repositories/payment.repository";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

export const PaymentListTable = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-payments"],
    queryFn: () => PaymentRepository.getMyPayments()
  });

  if (isLoading) {
    return (
      <div className="py-10 flex items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (isError) {
    const message = isAxiosError(error)
      ? error.response?.data?.message
      : "Failed to load payments";

    return <EmptyList message={message} />;
  }

  if (!data?.length) {
    return <EmptyList message="No payment records yet" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <H4>My Payments</H4>
        <TypographyMuted>{data.length} transaction(s)</TypographyMuted>
      </div>
      <PaymentsTable data={data} showPayer={false} showEvent />
    </div>
  );
};
