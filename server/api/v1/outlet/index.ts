import { USER_ROLE } from "@prisma/client";
import { Router } from "express";
import { authenticator } from "../../../middlewares/authenticator";
import inputValidator from "../../../middlewares/input-validator";
import { OutletCreateDTOSchema } from "../../../validationSchemas/outlet";
import { createOutletHandler } from "./controllers/create-outlet-controller";

const outletRouter = Router();

outletRouter.post(
  "/",
  inputValidator(OutletCreateDTOSchema),
  authenticator([USER_ROLE.SUPER_ADMIN]),
  createOutletHandler
);

export default outletRouter;
