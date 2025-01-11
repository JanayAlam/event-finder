import { Router } from "express";
import inputValidator from "../../../middlewares/input-validator";
import { GetAddressFromCoordinatesDTOSchema } from "../../../validationSchemas/map/map-schemas";
import { reverseGeocodeHandler } from "./controllers/map-controller";

const mapRouter = Router();

mapRouter.post(
  "/reverse/geocode",
  inputValidator(GetAddressFromCoordinatesDTOSchema),
  reverseGeocodeHandler
);

export default mapRouter;
