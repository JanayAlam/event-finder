import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import { ProductCategoryDeleteParam } from "../../../../types/product-category";
import ApiError from "../../../../utils/api-error";

export const deleteProductCategoryHandler = async (
  req: Request<ProductCategoryDeleteParam, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { outletId, productCategoryId } = req.params;

  try {
    if (req.user?.outlet?.id !== outletId) {
      throw new ApiError(403, "Forbidden");
    }

    const productCategory = await prisma.productCategory.findFirst({
      where: { id: productCategoryId, outletId }
    });

    if (!productCategory) {
      throw new ApiError(404, "Product category not found");
    }

    await prisma.productCategory.delete({
      where: { id: productCategoryId, outletId }
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const removeParentCategoryHandler = async (
  req: Request<ProductCategoryDeleteParam, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { outletId, productCategoryId } = req.params;

  try {
    if (req.user?.outlet?.id !== outletId) {
      throw new ApiError(403, "Forbidden");
    }

    const productCategory = await prisma.productCategory.findFirst({
      where: { id: productCategoryId, outletId }
    });
    if (!productCategory) {
      throw new ApiError(404, "Product category not found");
    }

    if (!productCategory.parentCategoryId) {
      throw new ApiError(400, "Product category has no parent category");
    }

    await prisma.productCategory.update({
      where: { id: productCategoryId, outletId },
      data: { parentCategoryId: null }
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
