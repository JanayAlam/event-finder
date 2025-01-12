import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import { updateOutletInfo } from "../../../../services/outlet";
import {
  TUpdateOutletParam,
  TUpdateOutletRequest
} from "../../../../types/outlet";
import ApiError from "../../../../utils/api-error";

export const updateOutletByOutletIdHandler = async (
  req: Request<TUpdateOutletParam, any, TUpdateOutletRequest, any>,
  res: Response,
  next: NextFunction
) => {
  const { outletId } = req.params;
  const body = req.body;

  if (!Object.keys(body).length) {
    res.status(400).json({
      message: "Invalid request body"
    });
    return;
  }

  try {
    const existingOutlet = await prisma.outlet.findUnique({
      where: { id: outletId }
    });

    if (!existingOutlet) {
      throw new ApiError(404, "Outlet not found");
    }

    const outlet = await updateOutletInfo(body, existingOutlet);

    res.status(200).json(outlet);
  } catch (err) {
    next(err);
  }
};

export const updateSelfOutletHandler = async (
  req: Request<any, any, TUpdateOutletRequest, any>,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;

  try {
    if (!Object.keys(body).length) {
      throw new ApiError(400, "Invalid request body");
    }

    const existingOutlet = await prisma.outlet.findUnique({
      where: { outletAdminId: req.user?.id }
    });

    if (!existingOutlet) {
      throw new ApiError(404, "Outlet not found");
    }

    const outlet = await updateOutletInfo(body, existingOutlet);

    res.status(200).json(outlet);
  } catch (err) {
    next(err);
  }
};
