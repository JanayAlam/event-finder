import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";

export const getAllDiscountsForOutletHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { outletId } = req.params;
  const { fetchDiscountsOnProducts } = req.query;

  try {
    const discounts = await prisma.discount.findMany({
      where: { outletId },
      include:
        fetchDiscountsOnProducts?.toString() === "true"
          ? {
              discountsOnProducts: {
                select: {
                  product: {
                    select: {
                      id: true,
                      name: true,
                      shortDescription: true,
                      basePhoto: true
                    }
                  }
                }
              }
            }
          : undefined
    });

    res.status(200).json(discounts);
  } catch (err) {
    next(err);
  }
};
