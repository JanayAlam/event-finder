import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import ApiError from "../../../../utils/api-error";

export const getAllFrequentProductsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { outletId, productId } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId, outletId },
      select: {
        frequentlyBoughtProducts: {
          select: {
            frequentlyBoughtProduct: {
              select: {
                id: true,
                name: true,
                shortDescription: true,
                description: true,
                basePhoto: true
              }
            }
          }
        }
      }
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    res
      .status(200)
      .json(
        product.frequentlyBoughtProducts.map(
          (fbp) => fbp.frequentlyBoughtProduct
        )
      );
  } catch (err) {
    next(err);
  }
};
