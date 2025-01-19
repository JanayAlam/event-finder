import { Router } from "express";
import inputValidator from "../../../middlewares/input-validator";
import { uploadImages } from "../../../middlewares/multer-config";
import { ProductCreateDTOSchema } from "../../../validationSchemas/product";

const productRouter = Router();

// create product
productRouter.post(
  "/",
  uploadImages.none(),
  inputValidator(ProductCreateDTOSchema),
  (req, res) => {
    console.log(req.body);

    res.send("Create product");
  }
);

export default productRouter;
