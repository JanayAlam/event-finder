import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import {
  removeFilesFromS3,
  uploadFileToS3
} from "../../../../services/amazonS3";
import { getFormattedCurrentDateTime } from "../../../../services/date";
import { PRODUCT_BRAND_PHOTO_UPLOAD_FOLDER_NAME } from "../../../../settings/constants";
import {
  TProductBrandGetParam,
  TProductBrandUpdateRequest
} from "../../../../types/product-brand/product-brand-types";
import ApiError from "../../../../utils/api-error";

export const updateProductBrandHandler = async (
  req: Request<TProductBrandGetParam, any, TProductBrandUpdateRequest, any>,
  res: Response,
  next: NextFunction
) => {
  const { productBrandId } = req.params;
  const { name, description, metaDescription, metaTitle, slug } = req.body;
  const file = req.file;

  try {
    const existingProductBrand = await prisma.productBrand.findUnique({
      where: { id: productBrandId }
    });

    if (!existingProductBrand) {
      throw new ApiError(404, "Product brand not found");
    }

    let filename: string | undefined;

    if (file) {
      if (existingProductBrand.brandPhoto) {
        await removeFilesFromS3(existingProductBrand.brandPhoto);
      }

      filename = `${PRODUCT_BRAND_PHOTO_UPLOAD_FOLDER_NAME}/${
        name || existingProductBrand.name
      }-${getFormattedCurrentDateTime("DDMMYYYYHHmmss")}.jpg`;
      await uploadFileToS3(file, { width: 120, height: 80 }, filename);
    }

    const productBrand = await prisma.productBrand.update({
      where: { id: productBrandId },
      data: {
        name,
        description,
        brandPhoto: filename || existingProductBrand.brandPhoto,
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
