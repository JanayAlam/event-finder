import { NextFunction, Request, Response } from "express";
import PaymentUseCase from "../../../libs/use-cases/payment.use-case";
import ApiError from "../../../utils/api-error.util";

class PaymentController {
  static async getMyPayments(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthenticated");
      }

      const payments = await PaymentUseCase.findByUser(req.user._id);

      res.status(200).json(payments);
    } catch (err) {
      next(err);
    }
  }
}

export default PaymentController;
