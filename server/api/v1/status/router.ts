import { Router } from "express";
import { authenticate } from "../../../middlewares/authenticator";
import { getHealthController } from "./controllers/getHealth.controller";

const statusRouter = Router({ mergeParams: true });

statusRouter.get("/health", authenticate(), getHealthController);

export default statusRouter;
