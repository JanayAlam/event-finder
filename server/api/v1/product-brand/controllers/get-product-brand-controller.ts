import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import { TProductBrandGetParam } from "../../../../types/product-brand/product-brand-types";
import ApiError from "../../../../utils/api-error";

export const getProductBrandHandler = async (
  req: Request<TProductBrandGetParam, any, any, any>,
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

    res.status(200).json(productBrand);
  } catch (err) {
    next(err);
  }
};

export const getAllProductBrandsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productBrands = await prisma.productBrand.findMany();
    res.status(200).json(productBrands);
  } catch (err) {
    next(err);
  }
};
