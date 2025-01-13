import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import { TProductCategoryDeleteParam } from "../../../../types/product-category";
import ApiError from "../../../../utils/api-error";

export const deleteProductCategoryHandler = async (
  req: Request<TProductCategoryDeleteParam, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { productCategoryId } = req.params;

  try {
    const productCategory = await prisma.productCategory.findUnique({
      where: { id: productCategoryId }
    });

    if (!productCategory) {
      throw new ApiError(404, "Product category not found");
    }

    await prisma.productCategory.delete({
      where: { id: productCategoryId }
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
