import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import { uploadFileToS3 } from "../../../../services/amazonS3";
import { getFormattedCurrentDateTime } from "../../../../services/date";
import { PRODUCT_BRAND_PHOTO_UPLOAD_FOLDER_NAME } from "../../../../settings/constants";
import { TProductBrandCreateRequest } from "../../../../types/product-brand/product-brand-types";
import ApiError from "../../../../utils/api-error";

export const createProductBrandHandler = async (
  req: Request<any, any, TProductBrandCreateRequest, any>,
  res: Response,
  next: NextFunction
) => {
  const { name, description, metaTitle, metaDescription, slug } = req.body;
  const brandPhoto = req.file;

  try {
    const outlet = await prisma.outlet.findUnique({
      where: { outletAdminId: req.user?.id || "" },
      select: { id: true }
    });

    if (!outlet) {
      throw new ApiError(401, "Unauthenticated");
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
        outlet: { connect: { id: outlet.id } }
      }
    });

    res.status(201).json(productBrand);
  } catch (err) {
    next(err);
  }
};
