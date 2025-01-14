import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
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
  const { name, description } = req.body;

  try {
    const existingProductBrand = await prisma.productBrand.findUnique({
      where: { id: productBrandId }
    });

    if (!existingProductBrand) {
      throw new ApiError(404, "Product brand not found");
    }

    const productBrand = await prisma.productBrand.update({
      where: { id: productBrandId },
      data: { name, description }
    });

    res.status(200).json(productBrand);
  } catch (err) {
    next(err);
  }
};
