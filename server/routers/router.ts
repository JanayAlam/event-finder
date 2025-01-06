import { Router } from "express";
import adminRouter from "../api/v1/admin";
import authRouter from "../api/v1/auth";

const router = Router();

// authentication routers
router.use("/auth", authRouter);

// admin routes
router.use("/admins", adminRouter);

export default router;
