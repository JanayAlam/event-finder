"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/shared/shadcn-components/alert";
import { AlertCircleIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

export const PaymentFailedAlert = () => {
  const searchParams = useSearchParams();

  const paymentStatus = searchParams.get("payment");
  const isPaymentFailed = paymentStatus === "failed";

  if (!isPaymentFailed) {
    return null;
  }

  return (
    <Alert variant="destructive" className="w-full bg-destructive/10">
      <AlertCircleIcon />
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>
        Your payment could not be processed. Please check your payment method
        and try again.
      </AlertDescription>
    </Alert>
  );
};
