import { Router } from "express";
import adminRouter from "../api/v1/admin";
import authRouter from "../api/v1/auth";
import customerRouter from "../api/v1/customer";
import mapRouter from "../api/v1/map";
import outletRouter from "../api/v1/outlet";

const router = Router();

// authentication routers
router.use("/auth", authRouter);

// admin routes
router.use("/admins", adminRouter);

// customer routes
router.use("/customers", customerRouter);

// outlet routes
router.use("/outlets", outletRouter);

// map routes
router.use("/maps", mapRouter);

export default router;
