import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import { removeFilesFromS3 } from "../../../../services/amazonS3";
import { ProductBrandDeleteParam } from "../../../../types/product-brand";
import ApiError from "../../../../utils/api-error";

export const deleteProductBrandHandler = async (
  req: Request<ProductBrandDeleteParam, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { outletId, productBrandId } = req.params;

  try {
    if (req.user?.outlet?.id !== outletId) {
      throw new ApiError(403, "Forbidden");
    }

    const productBrand = await prisma.productBrand.findUnique({
      where: { id: productBrandId, outletId }
    });

    if (!productBrand) {
      throw new ApiError(404, "Product brand not found");
    }

    await prisma.productBrand.delete({
      where: { id: productBrandId, outletId }
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const removeProductBrandPhotoHandler = async (
  req: Request<ProductBrandDeleteParam, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { outletId, productBrandId } = req.params;

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

    if (!existingProductBrand.brandPhoto) {
      res.status(200).json(existingProductBrand);
      return;
    }

    await removeFilesFromS3(existingProductBrand.brandPhoto);

    const productBrand = await prisma.productBrand.update({
      where: { id: productBrandId, outletId },
      data: {
        brandPhoto: null
      }
    });

    res.status(200).json(productBrand);
  } catch (err) {
    next(err);
  }
};
