import { Router } from "express";
import { getHealthController } from "../controllers/status.controller";

const statusRouter = Router({ mergeParams: true });

statusRouter.get("/health", getHealthController);

export default statusRouter;
