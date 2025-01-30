import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import { TPaginationQuery } from "../../../../types/common/common-types";
import { TProductGetAllParam } from "../../../../types/product";

export const getAllProductsHandler = async (
  req: Request<TProductGetAllParam, any, any, TPaginationQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const { outletId } = req.params;

    const products = await prisma.product.findMany({
      where: { outletId },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        // productCategory: true,
        // productBrand: true,
        // outlet: true,
        // productPriceAndSizes: true,
        // productAdditionalPhotos: true,
        // frequentlyBoughtProducts: true
      }
    });

    const totalProducts = await prisma.product.count();

    res.status(200).json({
      products,
      meta: {
        total: totalProducts,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(totalProducts / pageSize)
      }
    });
  } catch (err) {
    next(err);
  }
};
