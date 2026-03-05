import { TPayment } from "../../server/models/payment.model";

export type TEventPaymentResponseDto = Omit<TPayment, "user"> & {
  user: {
    _id: string;
    email: string;
  };
};
