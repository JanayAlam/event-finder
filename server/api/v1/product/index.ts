import { Router } from "express";
import inputValidator from "../../../middlewares/input-validator";
import { uploadImages } from "../../../middlewares/multer-config";
import ApiError from "../../../utils/api-error";
import { ProductCreateDTOSchema } from "../../../validationSchemas/product";

const productRouter = Router();

// create product
productRouter.post(
  "/",
  uploadImages.fields([
    { name: "basePhoto", maxCount: 1 },
    { name: "additionalPhotos", maxCount: 5 }
  ]),
  inputValidator(ProductCreateDTOSchema),
  (req, res) => {
    const files = req.files as Record<string, any>;
    const basePhoto = files["basePhoto"]?.[0];
    const additionalPhotos = files["additionalPhotos"];

    if (!files || !basePhoto) {
      throw new ApiError(400, undefined, {
        basePhoto: "Required"
      });
    }

    console.log(basePhoto);
    console.log(additionalPhotos);

    res.send(req.body);
  }
);

export default productRouter;
