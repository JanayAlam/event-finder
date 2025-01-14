import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import {
  TProductCategoryUpdateParam,
  TProductCategoryUpdateRequest
} from "../../../../types/product-category";
import ApiError from "../../../../utils/api-error";

export const updateProductCategoryHandler = async (
  req: Request<
    TProductCategoryUpdateParam,
    any,
    TProductCategoryUpdateRequest,
    any
  >,
  res: Response,
  next: NextFunction
) => {
  const { productCategoryId } = req.params;
  const { title, subtitle, parentCategoryId } = req.body;
  try {
    const existingProductCategory = await prisma.productCategory.findUnique({
      where: { id: productCategoryId }
    });

    if (!existingProductCategory) {
      throw new ApiError(404, "Product category not found");
    }

    const data: TProductCategoryUpdateRequest = { title, subtitle };

    if (parentCategoryId) {
      if (parentCategoryId === existingProductCategory.id) {
        throw new ApiError(400, undefined, {
          parentCategoryId:
            "Parent category cannot be the same as the category itself"
        });
      }

      const parentProductCategory = await prisma.productCategory.findUnique({
        where: { id: parentCategoryId, parentCategory: null }
      });

      if (!parentProductCategory) {
        throw new ApiError(400, undefined, {
          parentCategoryId: "Parent product category not found"
        });
      }

      data.parentCategoryId = parentProductCategory.id;
    }

    const productCategory = await prisma.productCategory.update({
      where: { id: existingProductCategory.id },
      data: data,
      include: {
        childCategories: true
      }
    });

    res.status(200).json(productCategory);
  } catch (err) {
    next(err);
  }
};
