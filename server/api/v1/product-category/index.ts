import { USER_ROLE } from "@prisma/client";
import { Router } from "express";
import { authenticator } from "../../../middlewares/authenticator";
import inputValidator from "../../../middlewares/input-validator";
import {
  ProductCategoryCreateDTOSchema,
  ProductCategoryDeleteDTOParamSchema,
  ProductCategoryGetAllQuerySchema,
  ProductCategoryGetDTOParamSchema,
  ProductCategoryUpdateDTOParamSchema,
  ProductCategoryUpdateDTOSchema
} from "../../../validationSchemas/product-category";
import { createProductCategoryHandler } from "./controllers/create-product-category-controller";
import {
  getAllProductCategoryHandler,
  getProductCategoryHandler
} from "./controllers/get-product-category-controller";
import { updateProductCategoryHandler } from "./controllers/update-product-category-controller";

const productCategoryRouter = Router();

// Create product category
productCategoryRouter.post(
  "/",
  inputValidator(ProductCategoryCreateDTOSchema),
  authenticator([USER_ROLE.OUTLET_ADMIN]),
  createProductCategoryHandler
);

// Get all product category
productCategoryRouter.get(
  "/",
  inputValidator(null, null, ProductCategoryGetAllQuerySchema),
  authenticator([USER_ROLE.SUPER_ADMIN, USER_ROLE.OUTLET_ADMIN]),
  getAllProductCategoryHandler
);

// Get single product category
productCategoryRouter.get(
  "/:productCategoryId",
  inputValidator(null, ProductCategoryGetDTOParamSchema),
  authenticator([USER_ROLE.SUPER_ADMIN, USER_ROLE.OUTLET_ADMIN]),
  getProductCategoryHandler
);

// Update product category
productCategoryRouter.patch(
  "/:productCategoryId",
  inputValidator(
    ProductCategoryUpdateDTOSchema,
    ProductCategoryUpdateDTOParamSchema
  ),
  authenticator([USER_ROLE.OUTLET_ADMIN]),
  updateProductCategoryHandler
);

// Delete product category
productCategoryRouter.delete(
  "/:productCategoryId",
  inputValidator(null, ProductCategoryDeleteDTOParamSchema),
  authenticator([USER_ROLE.OUTLET_ADMIN])
);

export default productCategoryRouter;
