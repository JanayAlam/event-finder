import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import {
  GetAllProductCategoryItemResponse,
  ProductCategoryGetAllParam,
  ProductCategoryGetAllQuery,
  ProductCategoryGetParam,
  ProductCategorySelectListItemResponse,
  ProductCategorySelectListParam
} from "../../../../types/product-category";
import ApiError from "../../../../utils/api-error";

type GetAllProductCategoryRequest = Request<
  ProductCategoryGetAllParam,
  any,
  any,
  ProductCategoryGetAllQuery
>;

export const getAllProductCategoryHandler = async (
  req: GetAllProductCategoryRequest,
  res: Response,
  next: NextFunction
) => {
  const { shouldIncludeChildProductCategories } = req.query;
  const { outletId } = req.params;

  try {
    const query = !!shouldIncludeChildProductCategories
      ? {
          outletId,
          patentCategoryId: null
        }
      : { outletId };

    const productCategories: GetAllProductCategoryItemResponse[] =
      await prisma.productCategory.findMany({
        where: query,
        include: {
          parentCategory: {
            select: {
              id: true,
              title: true,
              slug: true
            }
          },
          childCategories: !!shouldIncludeChildProductCategories
        }
      });

    res.status(200).json(productCategories);
  } catch (err) {
    next(err);
  }
};

export const getProductCategoryHandler = async (
  req: Request<ProductCategoryGetParam, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { outletId, productCategoryId } = req.params;

  try {
    const productCategory = await prisma.productCategory.findUnique({
      where: { id: productCategoryId, outletId },
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

export const getAvailableParentsHandler = async (
  req: Request<ProductCategoryGetParam, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { outletId, productCategoryId } = req.params;

  try {
    const existingProductCategory = await prisma.productCategory.findUnique({
      where: { id: productCategoryId, outletId },
      include: {
        childCategories: true,
        parentCategory: true
      }
    });

    if (!existingProductCategory) {
      throw new ApiError(404, "Product category not found");
    }

    if (existingProductCategory.childCategories.length) {
      res.status(200).json([]);
      return;
    }

    const availableParents: ProductCategorySelectListItemResponse[] =
      await prisma.productCategory.findMany({
        where: {
          id: {
            notIn: [
              productCategoryId,
              ...existingProductCategory.childCategories.map(
                (child) => child.id
              )
            ]
          },
          patentCategoryId: null
        },
        select: {
          id: true,
          slug: true,
          title: true,
          updatedAt: true,
          createdAt: true
        }
      });

    res.status(200).json(availableParents);
  } catch (error) {
    next(error);
  }
};

export const getProductCategorySelectListHandler = async (
  req: Request<ProductCategorySelectListParam, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { outletId } = req.params;

    const categories: ProductCategorySelectListItemResponse[] =
      await prisma.productCategory.findMany({
        where: { outletId },
        select: {
          id: true,
          slug: true,
          title: true,
          updatedAt: true,
          createdAt: true
        }
      });

    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};
