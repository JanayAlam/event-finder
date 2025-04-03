import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import {
  removeFilesFromS3,
  uploadFileToS3
} from "../../../../services/amazonS3";
import { getFormattedCurrentDateTime } from "../../../../services/date";
import { PRODUCT_BRAND_PHOTO_UPLOAD_FOLDER_NAME } from "../../../../settings/constants";
import {
  ProductBrandGetParam,
  ProductBrandUpdateRequest
} from "../../../../types/product-brand";
import ApiError from "../../../../utils/api-error";

export const updateProductBrandHandler = async (
  req: Request<ProductBrandGetParam, any, ProductBrandUpdateRequest, any>,
  res: Response,
  next: NextFunction
) => {
  const { outletId, productBrandId } = req.params;
  const { name, description, metaDescription, metaTitle, slug } = req.body;
  const file = req.file;

  try {
    if (req.user?.outlet?.id !== outletId) {
      throw new ApiError(403, "Forbidden");
    }

    const existingProductBrand = await prisma.productBrand.findUnique({
      where: { id: productBrandId, outletId }
    });

    if (!existingProductBrand) {
      throw new ApiError(404, "Product brand not found");
    }

    let productBrandPhotoKey: string | undefined;

    if (file) {
      if (existingProductBrand.brandPhoto) {
        await removeFilesFromS3(existingProductBrand.brandPhoto);
      }

      productBrandPhotoKey = `${PRODUCT_BRAND_PHOTO_UPLOAD_FOLDER_NAME}/${
        name?.replace(" ", "_") || existingProductBrand.name.replace(" ", "_")
      }-${getFormattedCurrentDateTime("DDMMYYYYHHmmss")}.jpg`;

      await uploadFileToS3(
        file,
        { width: 120, height: 80 },
        productBrandPhotoKey
      );
    }

    const productBrand = await prisma.productBrand.update({
      where: { id: productBrandId, outletId },
      data: {
        name,
        description,
        brandPhoto: productBrandPhotoKey || existingProductBrand.brandPhoto,
        metaDescription,
        metaTitle,
        slug
      }
    });

    res.status(200).json(productBrand);
  } catch (err) {
    next(err);
  }
};
