import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import { serializeUserResponse } from "../../../../serializers/user";

export const getAllOutletHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { outletAdmin } = req.query;

  try {
    // TODO: Pagination & Filters
    const outlets = await prisma.outlet.findMany({
      include: {
        outletAdmin: !!outletAdmin
      }
    });
    res.status(200).json(
      outlets.map((outlet) => ({
        ...outlet,
        outletAdmin: outlet.outletAdmin
          ? serializeUserResponse(outlet.outletAdmin)
          : undefined
      }))
    );
  } catch (err) {
    next(err);
  }
};
