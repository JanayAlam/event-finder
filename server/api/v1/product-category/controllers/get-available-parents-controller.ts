import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import { TProductCategoryGetParam } from "../../../../types/product-category";
import ApiError from "../../../../utils/api-error";

export const getAvailableParentsHandler = async (
  req: Request<TProductCategoryGetParam, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { productCategoryId } = req.params;

  try {
    const existingProductCategory = await prisma.productCategory.findUnique({
      where: { id: productCategoryId },
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

    // Find all categories except the current category and its children
    const availableParents = await prisma.productCategory.findMany({
      where: {
        id: {
          notIn: [
            productCategoryId,
            ...existingProductCategory.childCategories.map((child) => child.id)
          ]
        },
        patentCategoryId: null // Ensure no multiple layers of parent-child relationship
      }
    });

    res.status(200).json(availableParents);
  } catch (error) {
    next(error);
  }
};
