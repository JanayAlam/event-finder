import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import { removeFilesFromS3 } from "../../../../services/amazonS3";
import { TProductBrandDeleteParam } from "../../../../types/product-brand/product-brand-types";
import ApiError from "../../../../utils/api-error";

export const deleteProductBrandHandler = async (
  req: Request<TProductBrandDeleteParam, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { productBrandId } = req.params;

  try {
    const productBrand = await prisma.productBrand.findUnique({
      where: { id: productBrandId }
    });

    if (!productBrand) {
      throw new ApiError(404, "Product brand not found");
    }

    await prisma.productBrand.delete({
      where: { id: productBrandId }
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const removeProductBrandPhotoHandler = async (
  req: Request<TProductBrandDeleteParam, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { productBrandId } = req.params;

  try {
    const existingProductBrand = await prisma.productBrand.findUnique({
      where: { id: productBrandId }
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
      where: { id: productBrandId },
      data: {
        brandPhoto: null
      }
    });

    res.status(200).json(productBrand);
  } catch (err) {
    next(err);
  }
};
