import { USER_ROLE } from "@prisma/client";
import { Router } from "express";
import { authenticator } from "../../../middlewares/authenticator";
import inputValidator from "../../../middlewares/input-validator";
import { uploadSingleFile } from "../../../middlewares/multer-config";
import {
  ProductBrandCreateDTOSchema,
  ProductBrandDeleteDTOParamSchema,
  ProductBrandGetDTOParamSchema,
  ProductBrandUpdateDTOSchema
} from "../../../validationSchemas/product-brand";
import { createProductBrandHandler } from "./controllers/create-product-brand-controller";
import {
  deleteProductBrandHandler,
  removeProductBrandPhotoHandler
} from "./controllers/delete-product-brand-controller";
import {
  getAllProductBrandsHandler,
  getProductBrandHandler
} from "./controllers/get-product-brand-controller";
import { updateProductBrandHandler } from "./controllers/update-product-brand-controller";

const productBrandRouter = Router();

// Create product brand
productBrandRouter.post(
  "/",
  uploadSingleFile,
  inputValidator(ProductBrandCreateDTOSchema),
  authenticator([USER_ROLE.OUTLET_ADMIN]),
  createProductBrandHandler
);

// Get all product brands
productBrandRouter.get("/", getAllProductBrandsHandler);

// Get single product brand
productBrandRouter.get(
  "/:productBrandId",
  inputValidator(null, ProductBrandGetDTOParamSchema),
  getProductBrandHandler
);

// Update product brand
productBrandRouter.patch(
  "/:productBrandId",
  uploadSingleFile,
  inputValidator(ProductBrandUpdateDTOSchema, ProductBrandGetDTOParamSchema),
  authenticator([USER_ROLE.OUTLET_ADMIN]),
  updateProductBrandHandler
);

// Delete product brand
productBrandRouter.delete(
  "/:productBrandId",
  inputValidator(null, ProductBrandDeleteDTOParamSchema),
  authenticator([USER_ROLE.OUTLET_ADMIN]),
  deleteProductBrandHandler
);

// Delete product brand photo
productBrandRouter.delete(
  "/:productBrandId/remove-brand-photo",
  inputValidator(null, ProductBrandDeleteDTOParamSchema),
  authenticator([USER_ROLE.OUTLET_ADMIN]),
  removeProductBrandPhotoHandler
);

export default productBrandRouter;
