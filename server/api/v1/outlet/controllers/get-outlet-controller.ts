import { USER_ROLE } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import { serializeUserResponse } from "../../../../serializers/user";
import { TGetOutletParam, TGetOutletQuery } from "../../../../types/outlet";
import ApiError from "../../../../utils/api-error";

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

export const getOutletHandler = async (
  req: Request<TGetOutletParam, any, any, TGetOutletQuery>,
  res: Response,
  next: NextFunction
) => {
  const { outletId } = req.params;
  const { outletAdmin } = req.query;

  try {
    const outlet = await prisma.outlet.findUnique({
      where: { id: outletId },
      include: {
        outletAdmin: !!outletAdmin
      }
    });

    if (!outlet) {
      throw new ApiError(404, "Outlet not found");
    }

    res.status(200).json({
      ...outlet,
      outletAdmin: outlet.outletAdmin
        ? serializeUserResponse(outlet.outletAdmin)
        : undefined
    });
  } catch (err) {
    next(err);
  }
};

export const getSelfOutletHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.role !== USER_ROLE.OUTLET_ADMIN) {
      throw new ApiError(403, "Route is only valid for outlet admins");
    }

    if (!req.user.outlet) {
      throw new ApiError(404, "Outlet not found");
    }

    res.status(200).json(req.user.outlet);
  } catch (err) {
    next(err);
  }
};
