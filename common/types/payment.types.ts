import { Types } from "mongoose";
import { TPayment } from "../../server/models/payment.model";

export type TPaymentResponseDto = Omit<TPayment, "user" | "event"> & {
  user: {
    _id: string;
    email: string;
    profile?: {
      _id: Types.ObjectId;
      firstName: string;
      lastName: string;
    } | null;
  };
  event: {
    _id: string;
    title: string;
  };
};
