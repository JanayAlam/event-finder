import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import {
  ProductBrandGetAllParam,
  ProductBrandGetParam,
  ProductBrandSelectListItemResponse,
  ProductBrandSelectListParam
} from "../../../../types/product-brand";
import ApiError from "../../../../utils/api-error";

export const getProductBrandHandler = async (
  req: Request<ProductBrandGetParam, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { outletId, productBrandId } = req.params;

  try {
    const productBrand = await prisma.productBrand.findUnique({
      where: { id: productBrandId, outletId }
    });

    if (!productBrand) {
      throw new ApiError(404, "Product brand not found");
    }

    res.status(200).json(productBrand);
  } catch (err) {
    next(err);
  }
};

export const getAllProductBrandsHandler = async (
  req: Request<ProductBrandGetAllParam, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { outletId } = req.params;

  try {
    const productBrands = await prisma.productBrand.findMany({
      where: { outletId }
    });

    res.status(200).json(productBrands);
  } catch (err) {
    next(err);
  }
};

export const getProductBrandSelectListHandler = async (
  req: Request<ProductBrandSelectListParam, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { outletId } = req.params;

    const brands: ProductBrandSelectListItemResponse[] =
      await prisma.productBrand.findMany({
        where: { outletId },
        select: {
          id: true,
          slug: true,
          name: true,
          updatedAt: true,
          createdAt: true
        }
      });

    res.status(200).json(brands);
  } catch (err) {
    next(err);
  }
};
