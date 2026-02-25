import { Document, model, Schema, Types } from "mongoose";
import { PAYMENT_STATUS } from "../enums";
import { ITimestamps, ModelWithObjectId } from "../types/common";
import Event from "./event.model";
import User from "./user.model";

interface PaymentBase extends ITimestamps {
  user: Types.ObjectId;
  event: Types.ObjectId;
  amount: number;
  tranId: string;
  status: PAYMENT_STATUS;
  valId?: string;
  gatewayResponse?: any;
}

export interface IPaymentDoc extends PaymentBase, Document {
  _id: Types.ObjectId;
}

const paymentSchema = new Schema<IPaymentDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: User, required: true },
    event: { type: Schema.Types.ObjectId, ref: Event, required: true },
    amount: { type: Number, required: true },
    tranId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: PAYMENT_STATUS,
      default: PAYMENT_STATUS.PENDING
    },
    valId: { type: String },
    gatewayResponse: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

const Payment = model<IPaymentDoc>("payments", paymentSchema);

export type TPayment = ModelWithObjectId<PaymentBase>;

export default Payment;
