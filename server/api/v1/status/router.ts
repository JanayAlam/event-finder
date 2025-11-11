import { Router } from "express";
import { getHealthController } from "./controllers/get-health.controller";

const statusRouter = Router({ mergeParams: true });

statusRouter.get("/health", getHealthController);

export default statusRouter;
