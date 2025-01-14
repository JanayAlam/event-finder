import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
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
