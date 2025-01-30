import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import ApiError from "../../../../utils/api-error";

export const deleteDiscountHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { outletId, discountId } = req.params;

  try {
    if (!req.user || req.user.outlet?.id !== outletId) {
      throw new ApiError(401, "Unauthenticated");
    }

    const discount = await prisma.discount.findUnique({
      where: { id: discountId }
    });

    if (!discount) {
      throw new ApiError(404, "Discount not found");
    }

    await prisma.$transaction(
      async (tx) => {
        await tx.discountsOnProducts.deleteMany({
          where: { discountId }
        });

        await tx.discount.delete({
          where: { id: discountId }
        });
      },
      {
        timeout: 5 * 1000
      }
    );

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
