import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import { TProductBrandCreateRequest } from "../../../../types/product-brand/product-brand-types";
import ApiError from "../../../../utils/api-error";

export const createProductBrandHandler = async (
  req: Request<any, any, TProductBrandCreateRequest, any>,
  res: Response,
  next: NextFunction
) => {
  const { name, description } = req.body;
  try {
    const outlet = await prisma.outlet.findUnique({
      where: { outletAdminId: req.user?.id || "" },
      select: { id: true }
    });

    if (!outlet) {
      throw new ApiError(401, "Unauthenticated");
    }

    const productBrand = await prisma.productBrand.create({
      data: {
        name,
        description,
        outlet: { connect: { id: outlet.id } }
      }
    });

    res.status(201).json(productBrand);
  } catch (err) {
    next(err);
  }
};
