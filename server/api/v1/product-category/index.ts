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
import { deleteProductCategoryHandler } from "./controllers/delete-product-category-controller";
import { getAvailableParentsHandler } from "./controllers/get-available-parents-controller";
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
  getAllProductCategoryHandler
);

// Get single product category
productCategoryRouter.get(
  "/:productCategoryId",
  inputValidator(null, ProductCategoryGetDTOParamSchema),
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
  authenticator([USER_ROLE.OUTLET_ADMIN]),
  deleteProductCategoryHandler
);

productCategoryRouter.get(
  "/:productCategoryId/available-parents",
  inputValidator(null, ProductCategoryGetDTOParamSchema),
  getAvailableParentsHandler
);

export default productCategoryRouter;
