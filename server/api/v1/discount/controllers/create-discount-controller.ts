import { DISCOUNT_TYPE } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import {
  TDiscountCreateParam,
  TDiscountCreateRequest
} from "../../../../types/discount";
import ApiError from "../../../../utils/api-error";

export const createDiscountHandler = async (
  req: Request<TDiscountCreateParam, any, TDiscountCreateRequest>,
  res: Response,
  next: NextFunction
) => {
  const { outletId } = req.params;
  const { productIds, discountType, startsFrom, endsAt, flat, percent, title } =
    req.body;

  try {
    if (!req.user || req.user.outlet?.id !== outletId) {
      throw new ApiError(401, "Unauthenticated");
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        outletId
      },
      select: { id: true }
    });

    if (products.length !== productIds.length) {
      throw new ApiError(400, undefined, {
        productIds: "Some products are invalid or don't belong to this outlet"
      });
    }

    const discount = await prisma.discount.create({
      data: {
        title,
        discountType,
        flat: discountType === DISCOUNT_TYPE.FLAT ? flat || 0 : null,
        percent: discountType === DISCOUNT_TYPE.PERCENT ? percent || 0 : null,
        startsFrom,
        endsAt,
        outletId,
        discountsOnProducts: {
          create: productIds.map((productId) => ({
            product: { connect: { id: productId } }
          }))
        }
      }
    });

    res.status(201).json(discount);
  } catch (err) {
    next(err);
  }
};
