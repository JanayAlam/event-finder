import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import {
  TFrequentProductAddParam,
  TFrequentProductAddRequest
} from "../../../../types/frequent-product";
import ApiError from "../../../../utils/api-error";

export const addFrequentProductHandler = async (
  req: Request<TFrequentProductAddParam, any, TFrequentProductAddRequest, any>,
  res: Response,
  next: NextFunction
) => {
  const { outletId, productId } = req.params;
  const { productIds } = req.body;

  try {
    if (!req.user || req.user.outlet?.id !== outletId) {
      throw new ApiError(401, "Unauthenticated");
    }

    const [product, validProducts, existingFrequentProducts] =
      await Promise.all([
        prisma.product.findUnique({
          where: { id: productId, outletId },
          select: { id: true }
        }),
        prisma.product.findMany({
          where: {
            id: { in: productIds },
            outletId,
            NOT: { id: productId }
          },
          select: { id: true }
        }),
        prisma.frequentlyBoughtProduct.findMany({
          where: {
            productId,
            frequentlyBoughtProductId: { in: productIds }
          },
          select: { frequentlyBoughtProductId: true }
        })
      ]);

    if (!product) {
      throw new ApiError(400, undefined, {
        productId: "Invalid product id"
      });
    }

    const validProductIds = validProducts.map((p) => p.id);
    if (validProductIds.length !== productIds.length) {
      throw new ApiError(400, undefined, {
        productIds: "Some product IDs are invalid or include the self product"
      });
    }

    const existingFrequentProductIds = existingFrequentProducts.map(
      (fp) => fp.frequentlyBoughtProductId
    );
    const newFrequentProductIds = validProductIds.filter(
      (id) => !existingFrequentProductIds.includes(id)
    );

    if (newFrequentProductIds.length === 0) {
      res.status(204).send();
      return;
    }

    await prisma.frequentlyBoughtProduct.createMany({
      data: newFrequentProductIds.map((frequentlyBoughtProductId) => ({
        productId,
        frequentlyBoughtProductId
      })),
      skipDuplicates: true
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
