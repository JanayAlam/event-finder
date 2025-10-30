import { Router } from "express";
import authRouter from "../api/v1/auth";
import statusRouter from "../api/v1/status";

const router = Router({ mergeParams: true });

// all routers
router.use("/status", statusRouter);
router.use("/auth", authRouter);

export default router;
