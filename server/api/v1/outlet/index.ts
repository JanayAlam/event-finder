import { USER_ROLE } from "@prisma/client";
import { Router } from "express";
import { authenticator } from "../../../middlewares/authenticator";
import inputValidator from "../../../middlewares/input-validator";
import { OutletCreateDTOSchema } from "../../../validationSchemas/outlet";
import { createOutletHandler } from "./controllers/create-outlet-controller";
import { getAllOutletHandler } from "./controllers/get-outlet-controller";

const outletRouter = Router();

outletRouter.post(
  "/",
  inputValidator(OutletCreateDTOSchema),
  authenticator([USER_ROLE.SUPER_ADMIN]),
  createOutletHandler
);

outletRouter.get(
  "/",
  authenticator([USER_ROLE.SUPER_ADMIN]),
  getAllOutletHandler
);

export default outletRouter;
