import { Router } from "express";
import accountVerificationRouter from "./account-verification.router";
import authRouter from "./auth.router";
import profileRouter from "./profile.router";
import statusRouter from "./status.router";
import userRouter from "./user.router";

const router = Router({ mergeParams: true });

router.use("/status", statusRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/profiles", profileRouter);
router.use("/account-verifications", accountVerificationRouter);

export default router;
