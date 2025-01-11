import { USER_ROLE } from "@prisma/client";
import { Router } from "express";
import { authenticator } from "../../../middlewares/authenticator";
import inputValidator from "../../../middlewares/input-validator";
import { GetAddressFromCoordinatesDTOSchema } from "../../../validationSchemas/map/map-schemas";
import { reverseGeocodeHandler } from "./controllers/map-controller";

const mapRouter = Router();

mapRouter.post(
  "/reverse/geocode",
  inputValidator(GetAddressFromCoordinatesDTOSchema),
  authenticator([
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.OUTLET_ADMIN,
    USER_ROLE.CUSTOMER
  ]),
  reverseGeocodeHandler
);

export default mapRouter;
