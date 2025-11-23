import { Router } from "express";
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

export default router;
