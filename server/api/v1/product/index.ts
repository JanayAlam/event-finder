import { USER_ROLE } from "@prisma/client";
import { Router } from "express";
import { authenticator } from "../../../middlewares/authenticator";
import inputValidator from "../../../middlewares/input-validator";
import { uploadImages } from "../../../middlewares/multer-config";
import { PaginationQuerySchema } from "../../../validationSchemas/common";
import {
  ProductCreateDTOSchema,
  ProductCreateParamSchema,
  ProductGetAllParamSchema
} from "../../../validationSchemas/product";
import frequentProductRouter from "../frequent-products";
import { createProduct } from "./controllers/create-product-controller";
import {
  getAllDiscountsForProductHandler,
  getAllProductsHandler
} from "./controllers/get-product-controller";
import { updateProductBasePhotoHandler } from "./controllers/update-product-controller";

const productRouter = Router({ mergeParams: true });

// create product
productRouter.post(
  "/",
  authenticator([USER_ROLE.OUTLET_ADMIN]),
  uploadImages.fields([
    { name: "basePhoto", maxCount: 1 }
    // { name: "additionalPhotos", maxCount: 5 }
  ]),
  inputValidator(ProductCreateDTOSchema, ProductCreateParamSchema),
  createProduct
);

// get all products
productRouter.get(
  "/",
  inputValidator(null, ProductGetAllParamSchema, PaginationQuerySchema),
  getAllProductsHandler
);

// get all discounts on a specific products
productRouter.get("/:productId/discounts", getAllDiscountsForProductHandler);

// update base photo
productRouter.patch(
  "/:productId/update/base-photo",
  authenticator([USER_ROLE.OUTLET_ADMIN]),
  uploadImages.single("basePhoto"),
  updateProductBasePhotoHandler
);

// frequent product router
productRouter.use("/:productId/frequent-products", frequentProductRouter);

export default productRouter;
