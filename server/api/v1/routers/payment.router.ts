import { Router } from "express";
import { authenticate } from "../../../middlewares/authenticator.middleware";
import PaymentController from "../controllers/payment.controller";

const paymentRouter = Router({ mergeParams: true });

paymentRouter.get("/me", authenticate(), PaymentController.getMyPayments);

export default paymentRouter;
