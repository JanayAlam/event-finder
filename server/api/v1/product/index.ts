import { USER_ROLE } from "@prisma/client";
import { Router } from "express";
import { authenticator } from "../../../middlewares/authenticator";
import inputValidator from "../../../middlewares/input-validator";
import { uploadImages } from "../../../middlewares/multer-config";
import { ProductCreateDTOSchema } from "../../../validationSchemas/product";
import { createProduct } from "./controllers/create-product-controller";
import { getAllProductsHandler } from "./controllers/get-product-controller";
import { updateProductBasePhotoHandler } from "./controllers/update-product-controller";

const productRouter = Router();

// create product
productRouter.post(
  "/",
  authenticator([USER_ROLE.OUTLET_ADMIN]),
  uploadImages.fields([
    { name: "basePhoto", maxCount: 1 }
    // { name: "additionalPhotos", maxCount: 5 }
  ]),
  inputValidator(ProductCreateDTOSchema),
  createProduct
);

// get all products
productRouter.get("/", getAllProductsHandler);

// get all product list by outlet id

// update base photo
productRouter.patch(
  "/:productId/update/base-photo",
  authenticator([USER_ROLE.OUTLET_ADMIN]),
  uploadImages.single("basePhoto"),
  updateProductBasePhotoHandler
);

export default productRouter;
