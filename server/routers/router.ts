import { Router } from "express";
import adminRouter from "../api/v1/admin";
import authRouter from "../api/v1/auth";
import customerRouter from "../api/v1/customer";

const router = Router();

// authentication routers
router.use("/auth", authRouter);

// admin routes
router.use("/admins", adminRouter);

// customer routes
router.use("/customers", customerRouter);

export default router;
