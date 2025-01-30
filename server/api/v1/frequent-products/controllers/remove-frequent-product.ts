import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import {
  TFrequentProductRemoveParam,
  TFrequentProductRemoveRequest
} from "../../../../types/frequent-product";
import ApiError from "../../../../utils/api-error";

export const removeFrequentProductsHandler = async (
  req: Request<
    TFrequentProductRemoveParam,
    any,
    any,
    TFrequentProductRemoveRequest,
    any
  >,
  res: Response,
  next: NextFunction
) => {
  const { outletId, productId } = req.params;
  const { productIds } = req.body;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId, outletId },
      select: { id: true }
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    await prisma.frequentlyBoughtProduct.deleteMany({
      where: {
        productId,
        frequentlyBoughtProductId: { in: productIds }
      }
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
