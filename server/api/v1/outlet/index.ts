import { USER_ROLE } from "@prisma/client";
import { Router } from "express";
import { authenticator } from "../../../middlewares/authenticator";
import inputValidator from "../../../middlewares/input-validator";
import {
  GetOutletDTOParamSchema,
  GetOutletDTOQuerySchema,
  OutletCreateDTOSchema,
  UpdateOutletDTOParamSchema,
  UpdateOutletDTOSchema
} from "../../../validationSchemas/outlet";
import { createOutletHandler } from "./controllers/create-outlet-controller";
import {
  getAllOutletHandler,
  getOutletHandler,
  getSelfOutletHandler
} from "./controllers/get-outlet-controller";
import {
  updateOutletByOutletIdHandler,
  updateSelfOutletHandler
} from "./controllers/update-outlet-controller";

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

outletRouter.patch(
  "/:outletId",
  inputValidator(UpdateOutletDTOSchema, UpdateOutletDTOParamSchema),
  authenticator([USER_ROLE.SUPER_ADMIN]),
  updateOutletByOutletIdHandler
);

outletRouter.get(
  "/self/get",
  authenticator([USER_ROLE.OUTLET_ADMIN]),
  getSelfOutletHandler
);

outletRouter.patch(
  "/self/update",
  inputValidator(UpdateOutletDTOSchema),
  authenticator([USER_ROLE.OUTLET_ADMIN]),
  updateSelfOutletHandler
);

export default outletRouter;
