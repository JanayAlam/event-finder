import { Metadata } from "next";
import { PaymentListTable } from "./payment-list-table";

export const metadata: Metadata = {
  title: "Payments"
};

export default function PaymentPage() {
  return <PaymentListTable />;
}
