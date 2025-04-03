import { USER_ROLE } from "@prisma/client";
import { Router } from "express";
import { authenticator } from "../../../middlewares/authenticator";
import inputValidator from "../../../middlewares/input-validator";
import { uploadImages } from "../../../middlewares/multer-config";
import {
  ProductCategoryCreateDTOParamSchema,
  ProductCategoryCreateDTOSchema,
  ProductCategoryDeleteDTOParamSchema,
  ProductCategoryGetAllDTOParamDTOSchema,
  ProductCategoryGetAllQuerySchema,
  ProductCategoryGetDTOParamSchema,
  ProductCategorySelectListDTOParamSchema,
  ProductCategoryUpdateDTOParamSchema,
  ProductCategoryUpdateDTOSchema
} from "../../../validationSchemas/product-category";
import { createProductCategoryHandler } from "./controllers/create-product-category-controller";
import { deleteProductCategoryHandler } from "./controllers/delete-product-category-controller";
import {
  getAllProductCategoryHandler,
  getAvailableParentsHandler,
  getProductCategoryHandler,
  getProductCategorySelectListHandler
} from "./controllers/get-product-category-controller";
import { updateProductCategoryHandler } from "./controllers/update-product-category-controller";

const productCategoryRouter = Router({ mergeParams: true });

// Create product category
productCategoryRouter.post(
  "/",
  uploadImages.fields([
    { name: "bannerPhoto", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
    { name: "icon", maxCount: 1 }
  ]),
  inputValidator(
    ProductCategoryCreateDTOSchema,
    ProductCategoryCreateDTOParamSchema
  ),
  authenticator([USER_ROLE.OUTLET_ADMIN]),
  createProductCategoryHandler
);

// Get all product category
productCategoryRouter.get(
  "/",
  inputValidator(
    null,
    ProductCategoryGetAllDTOParamDTOSchema,
    ProductCategoryGetAllQuerySchema
  ),
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
  uploadImages.fields([
    { name: "bannerPhoto", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
    { name: "icon", maxCount: 1 }
  ]),
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

// Get product category select list
productCategoryRouter.get(
  "/select/list",
  inputValidator(null, ProductCategorySelectListDTOParamSchema),
  getProductCategorySelectListHandler
);

export default productCategoryRouter;
