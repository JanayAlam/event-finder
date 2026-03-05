import { Types } from "mongoose";
import { TPaymentResponseDto } from "../../../common/types";
import { PAYMENT_STATUS } from "../../enums";
import Payment, { TPayment } from "../../models/payment.model";

class PaymentUseCase {
  static async create(data: {
    user: Types.ObjectId;
    event: Types.ObjectId;
    amount: number;
    tranId: string;
  }): Promise<TPayment | null> {
    const payment = await Payment.create({
      ...data,
      status: PAYMENT_STATUS.PENDING
    });
    return payment.toObject() as TPayment;
  }

  static async findByTranId(tranId: string): Promise<TPayment | null> {
    return Payment.findOne({ tranId }).lean<TPayment>().exec();
  }

  static async findPendingByUserAndEvent(
    userId: Types.ObjectId,
    eventId: Types.ObjectId
  ): Promise<TPayment | null> {
    return Payment.findOne({
      user: userId,
      event: eventId,
      status: PAYMENT_STATUS.PENDING
    })
      .lean<TPayment>()
      .exec();
  }

  static async markSuccess(
    tranId: string,
    valId: string,
    gatewayResponse: any
  ): Promise<TPayment | null> {
    return Payment.findOneAndUpdate(
      { tranId },
      { status: PAYMENT_STATUS.SUCCESS, valId, gatewayResponse },
      { new: true }
    )
      .lean<TPayment>()
      .exec();
  }

  static async markFailed(
    tranId: string,
    gatewayResponse: any
  ): Promise<TPayment | null> {
    return Payment.findOneAndUpdate(
      { tranId },
      { status: PAYMENT_STATUS.FAILED, gatewayResponse },
      { new: true }
    )
      .lean<TPayment>()
      .exec();
  }

  static async markCancelled(
    tranId: string,
    gatewayResponse: any
  ): Promise<TPayment | null> {
    return Payment.findOneAndUpdate(
      { tranId },
      { status: PAYMENT_STATUS.CANCELLED, gatewayResponse },
      { new: true }
    )
      .lean<TPayment>()
      .exec();
  }

  static async findByEvent(
    eventId: Types.ObjectId
  ): Promise<TPaymentResponseDto[]> {
    return Payment.find({ event: eventId })
      .populate({
        path: "user",
        select: "_id email profile",
        populate: {
          path: "profile",
          select: "_id firstName lastName"
        }
      })
      .populate({ path: "event", select: "_id title" })
      .sort({ createdAt: -1 })
      .lean<TPaymentResponseDto[]>()
      .exec();
  }

  static async findByUser(
    userId: Types.ObjectId
  ): Promise<TPaymentResponseDto[]> {
    return Payment.find({ user: userId })
      .populate({
        path: "user",
        select: "_id email profile",
        populate: {
          path: "profile",
          select: "_id firstName lastName"
        }
      })
      .populate({ path: "event", select: "_id title" })
      .sort({ createdAt: -1 })
      .lean<TPaymentResponseDto[]>()
      .exec();
  }
}

export default PaymentUseCase;
