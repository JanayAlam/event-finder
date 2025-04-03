import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import { uploadFileToS3 } from "../../../../services/amazonS3";
import { getFormattedCurrentDateTime } from "../../../../services/date";
import { PRODUCT_BRAND_PHOTO_UPLOAD_FOLDER_NAME } from "../../../../settings/constants";
import {
  ProductBrandCreateParam,
  ProductBrandCreateRequest
} from "../../../../types/product-brand";
import ApiError from "../../../../utils/api-error";

export const createProductBrandHandler = async (
  req: Request<ProductBrandCreateParam, any, ProductBrandCreateRequest, any>,
  res: Response,
  next: NextFunction
) => {
  const { outletId } = req.params;
  const { name, description, metaTitle, metaDescription, slug } = req.body;
  const brandPhoto = req.file;

  try {
    if (req.user?.outlet?.id !== outletId) {
      throw new ApiError(403, "Forbidden");
    }

    let productBrandPhotoKey: string | undefined;

    if (brandPhoto) {
      productBrandPhotoKey = `${PRODUCT_BRAND_PHOTO_UPLOAD_FOLDER_NAME}/${name.replace(
        " ",
        "_"
      )}-${getFormattedCurrentDateTime("DDMMYYYYHHmmss")}.jpg`;

      await uploadFileToS3(
        brandPhoto,
        { width: 120, height: 80 },
        productBrandPhotoKey
      );
    }

    const productBrand = await prisma.productBrand.create({
      data: {
        name,
        description,
        brandPhoto: productBrandPhotoKey,
        metaTitle,
        metaDescription,
        slug,
        outlet: { connect: { id: outletId } }
      }
    });

    res.status(201).json(productBrand);
  } catch (err) {
    next(err);
  }
};
