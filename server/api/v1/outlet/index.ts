import { USER_ROLE } from "@prisma/client";
import { Router } from "express";
import { authenticator } from "../../../middlewares/authenticator";
import inputValidator from "../../../middlewares/input-validator";
import {
  GetOutletDTOParamSchema,
  GetOutletDTOQuerySchema,
  OutletCreateDTOSchema
} from "../../../validationSchemas/outlet";
import { createOutletHandler } from "./controllers/create-outlet-controller";
import {
  getAllOutletHandler,
  getOutletHandler,
  getSelfOutletHandler
} from "./controllers/get-outlet-controller";

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

outletRouter.get(
  "/:outletId",
  inputValidator(null, GetOutletDTOParamSchema, GetOutletDTOQuerySchema),
  authenticator([USER_ROLE.SUPER_ADMIN]),
  getOutletHandler
);

outletRouter.get(
  "/self/get",
  authenticator([USER_ROLE.OUTLET_ADMIN]),
  getSelfOutletHandler
);

export default outletRouter;
