import { Router } from "express";
import adminRouter from "../api/v1/admin";
import authRouter from "../api/v1/auth";
import customerRouter from "../api/v1/customer";
import mapRouter from "../api/v1/map";
import outletRouter from "../api/v1/outlet";
import productBrandRouter from "../api/v1/product-brand";
import productCategoryRouter from "../api/v1/product-category";

const router = Router();

// authentication routers
router.use("/auth", authRouter);

// admin routes
router.use("/admins", adminRouter);

// map routes
router.use("/maps", mapRouter);

// customer routes
router.use("/customers", customerRouter);

// outlet routes
router.use("/outlets", outletRouter);

// product category routes
router.use("/product-categories", productCategoryRouter);

// product brand routes
router.use("/product-brands", productBrandRouter);

export default router;
