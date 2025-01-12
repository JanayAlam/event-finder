import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import {
  TProductCategoryGetAllQuery,
  TProductCategoryGetParam
} from "../../../../types/product-category";
import ApiError from "../../../../utils/api-error";

export const getAllProductCategoryHandler = async (
  req: Request<any, any, any, TProductCategoryGetAllQuery>,
  res: Response,
  next: NextFunction
) => {
  const { shouldIncludeChildProductCategories } = req.query;

  try {
    const query = !!shouldIncludeChildProductCategories
      ? {
          patentCategoryId: null
        }
      : {};

    const productCategories = await prisma.productCategory.findMany({
      where: query,
      include: {
        childCategories: !!shouldIncludeChildProductCategories
      }
    });

    res.status(200).json(productCategories);
  } catch (err) {
    next(err);
  }
};

export const getProductCategoryHandler = async (
  req: Request<TProductCategoryGetParam, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { productCategoryId } = req.params;

  try {
    const productCategory = await prisma.productCategory.findUnique({
      where: { id: productCategoryId },
      include: {
        childCategories: true
      }
    });

    if (!productCategory) {
      throw new ApiError(404, "Product category not found");
    }

    res.status(200).json(productCategory);
  } catch (err) {
    next(err);
  }
};
