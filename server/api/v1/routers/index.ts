import { Router } from "express";
import accountVerificationRouter from "./account-verification.router";
import adminRouter from "./admin.router";
import aiRouter from "./ai.router";
import authRouter from "./auth.router";
import eventRouter from "./event.router";
import profileReviewRouter from "./profile-review.router";
import profileRouter from "./profile.router";
import promotionRequestRouter from "./promotion-request.router";
import statusRouter from "./status.router";
import userRouter from "./user.router";

const router = Router({ mergeParams: true });

router.use("/status", statusRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/profiles", profileRouter);
router.use("/profile-reviews", profileReviewRouter);
router.use("/account-verifications", accountVerificationRouter);
router.use("/admins", adminRouter);
router.use("/promotion-requests", promotionRequestRouter);
router.use("/events", eventRouter);
router.use("/ai", aiRouter);

export default router;
