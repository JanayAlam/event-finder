import { Router } from "express";
import StatusController from "../controllers/status.controller";

const statusRouter = Router({ mergeParams: true });

statusRouter.get("/health", StatusController.health);

export default statusRouter;
