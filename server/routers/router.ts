import { Router } from "express";
import accountVerificationRouter from "../api/v1/account-verification";
import authRouter from "../api/v1/auth";
import profileRouter from "../api/v1/profiles";
import statusRouter from "../api/v1/status";
import userRouter from "../api/v1/users";

const router = Router({ mergeParams: true });

// all routers
router.use("/status", statusRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/profiles", profileRouter);
router.use("/account-verifications", accountVerificationRouter);

export default router;
