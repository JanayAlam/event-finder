import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import { TProductCategoryCreateRequest } from "../../../../types/product-category";
import ApiError from "../../../../utils/api-error";

export const createProductCategoryHandler = async (
  req: Request<any, any, TProductCategoryCreateRequest, any>,
  res: Response,
  next: NextFunction
) => {
  const { title, subtitle, parentCategoryId } = req.body;
  try {
    if (parentCategoryId) {
      const parentCategory = await prisma.productCategory.findUnique({
        where: { id: parentCategoryId }
      });

      if (!parentCategory) {
        throw new ApiError(404, "Parent category not found");
      }

      const productCategory = await prisma.productCategory.create({
        data: {
          title,
          subtitle,
          parentCategory: {
            connect: { id: parentCategoryId }
          }
        }
      });

      res.status(201).json(productCategory);
      return;
    }

    const productCategory = await prisma.productCategory.create({
      data: { title, subtitle }
    });

    res.status(201).json(productCategory);
  } catch (err) {
    next(err);
  }
};
