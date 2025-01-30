import { USER_ROLE } from "@prisma/client";
import { Router } from "express";
import { authenticator } from "../../../middlewares/authenticator";
import inputValidator from "../../../middlewares/input-validator";
import {
  DiscountCreateParamSchema,
  DiscountCreateSchema
} from "../../../validationSchemas/discount";
import { createDiscountHandler } from "./controllers/create-discount-controller";

const discountRouter = Router({ mergeParams: true });

// create discount
discountRouter.post(
  "/",
  inputValidator(DiscountCreateSchema, DiscountCreateParamSchema),
  authenticator([USER_ROLE.OUTLET_ADMIN]),
  createDiscountHandler
);

export default discountRouter;
