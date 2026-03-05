"use client";

import { EmptyList } from "@/components/shared/molecules/empty";
import { Badge } from "@/components/shared/shadcn-components/badge";
import { Spinner } from "@/components/shared/shadcn-components/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/shared/shadcn-components/table";
import {
  H4,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import EventRepository from "@/repositories/event.repository";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import dayjs from "dayjs";
import { PAYMENT_STATUS } from "../../../../server/enums";

interface EventPaymentsProps {
  eventId: string;
}

const getStatusVariant = (status: PAYMENT_STATUS) => {
  if (status === PAYMENT_STATUS.SUCCESS) return "success";
  if (status === PAYMENT_STATUS.FAILED) return "destructive";
  if (status === PAYMENT_STATUS.CANCELLED) return "secondary";
  return "outline";
};

export const EventPayments = ({ eventId }: EventPaymentsProps) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["event-payments", eventId],
    queryFn: () => EventRepository.getPayments(eventId)
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
    return <EmptyList message="No payments yet" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <H4>Payment Records</H4>
        <TypographyMuted>{data.length} transaction(s)</TypographyMuted>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payer</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((payment) => (
            <TableRow key={payment._id.toString()}>
              <TableCell>{payment.user?.email || "Unknown user"}</TableCell>
              <TableCell className="font-mono text-xs">
                {payment.tranId}
              </TableCell>
              <TableCell>
                <Badge
                  variant={getStatusVariant(payment.status)}
                  className="capitalize"
                >
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell>BDT {payment.amount}</TableCell>
              <TableCell>
                {dayjs(payment.createdAt).format("MMM D, YYYY h:mm A")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
