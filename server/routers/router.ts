import { Router } from "express";
import authRouter from "../api/v1/auth";

const router = Router();

// authentication routers
router.use("/auth", authRouter);

export default router;
