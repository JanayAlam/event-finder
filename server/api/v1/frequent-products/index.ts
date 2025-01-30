import { USER_ROLE } from "@prisma/client";
import { Router } from "express";
import { authenticator } from "../../../middlewares/authenticator";
import inputValidator from "../../../middlewares/input-validator";
import {
  FrequentProductAddDTOSchema,
  FrequentProductAddParamSchema,
  FrequentProductGetAllParamSchema,
  FrequentProductRemoveDTOSchema,
  FrequentProductRemoveParamSchema
} from "../../../validationSchemas/frequent-product";
import { addFrequentProductHandler } from "./controllers/add-frequent-product";
import { getAllFrequentProductsHandler } from "./controllers/get-frequent-product";
import { removeFrequentProductsHandler } from "./controllers/remove-frequent-product";

const frequentProductRouter = Router({ mergeParams: true });

// add frequent products
frequentProductRouter.post(
  "/",
  inputValidator(FrequentProductAddDTOSchema, FrequentProductAddParamSchema),
  authenticator([USER_ROLE.OUTLET_ADMIN]),
  addFrequentProductHandler
);

// get all frequent products
frequentProductRouter.get(
  "/",
  inputValidator(null, FrequentProductGetAllParamSchema),
  getAllFrequentProductsHandler
);

frequentProductRouter.delete(
  "/",
  inputValidator(
    FrequentProductRemoveDTOSchema,
    FrequentProductRemoveParamSchema
  ),
  authenticator([USER_ROLE.OUTLET_ADMIN]),
  removeFrequentProductsHandler
);

frequentProductRouter.get("/:frequentProductId");

export default frequentProductRouter;
