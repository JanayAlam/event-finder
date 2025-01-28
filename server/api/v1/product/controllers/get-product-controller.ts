import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";

export const getAllProductsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const pageSizeNumber = parseInt(pageSize as string, 10);

    const products = await prisma.product.findMany({
      skip: (pageNumber - 1) * pageSizeNumber,
      take: pageSizeNumber,
      include: {
        productCategory: true,
        productBrand: true,
        outlet: true,
        productPriceAndSizes: true,
        productAdditionalPhotos: true,
        frequentlyBoughtProducts: true
      }
    });

    const totalProducts = await prisma.product.count();

    res.status(200).json({
      products,
      meta: {
        total: totalProducts,
        page: pageNumber,
        pageSize: pageSizeNumber,
        totalPages: Math.ceil(totalProducts / pageSizeNumber)
      }
    });
  } catch (err) {
    next(err);
  }
};
