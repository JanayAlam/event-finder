"use client";

import { Badge } from "@/components/shared/shadcn-components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/shared/shadcn-components/table";
import { PUBLIC_DYNAMIC_PAGE_ROUTE } from "@/routes";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";
import { TPaymentResponseDto } from "../../../../../common/types";
import { PAYMENT_STATUS } from "../../../../../server/enums";
import { Paragraph, TypographyMuted } from "../../shadcn-components/typography";

interface PaymentsTableProps {
  data: TPaymentResponseDto[];
  showPayer?: boolean;
  showEvent?: boolean;
}

const getStatusVariant = (status: PAYMENT_STATUS) => {
  if (status === PAYMENT_STATUS.SUCCESS) return "success";
  if (status === PAYMENT_STATUS.FAILED) return "destructive";
  if (status === PAYMENT_STATUS.CANCELLED) return "secondary";
  return "outline";
};

export const PaymentsTable: React.FC<PaymentsTableProps> = ({
  data,
  showPayer = true,
  showEvent = false
}) => {
  const getEventTitle = (event: TPaymentResponseDto["event"]) => {
    if (
      event &&
      typeof event === "object" &&
      "title" in event &&
      typeof event.title === "string"
    ) {
      return event.title;
    }

    return null;
  };

  const getPayerName = (user: TPaymentResponseDto["user"]) => {
    if (!user?.email && !user?.profile) return "Unknown user";

    if (
      user?.profile &&
      "firstName" in user.profile &&
      "lastName" in user.profile
    ) {
      return `${user.profile.firstName} ${user.profile.lastName}`;
    }

    return user.email;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {showPayer && <TableHead>Payer</TableHead>}
          {showEvent && <TableHead>Event</TableHead>}
          <TableHead>Transaction ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((payment) => (
          <TableRow key={payment._id.toString()}>
            {showPayer && (
              <TableCell>
                <div className="flex flex-col gap-0">
                  <Link
                    href={PUBLIC_DYNAMIC_PAGE_ROUTE.PROFILE(
                      payment.user?.profile?._id?.toString() || ""
                    )}
                    className="hover:underline hover:text-primary"
                  >
                    <Paragraph>{getPayerName(payment.user)}</Paragraph>
                  </Link>
                  <TypographyMuted>{payment.user?.email}</TypographyMuted>
                </div>
              </TableCell>
            )}
            {showEvent && (
              <TableCell>
                <Link
                  href={PUBLIC_DYNAMIC_PAGE_ROUTE.EVENT_DETAILS(
                    payment.event?._id?.toString() || ""
                  )}
                  className="hover:underline hover:text-primary"
                >
                  {getEventTitle(payment.event) || "Unknown event"}
                </Link>
              </TableCell>
            )}
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
  );
};
