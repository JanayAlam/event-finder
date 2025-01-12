import { USER_ROLE } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import {
  getAddressFromCoordinates,
  getGoogleMapLink
} from "../../../../services/google-map";
import { TOutletCreateRequest } from "../../../../types/outlet";
import ApiError from "../../../../utils/api-error";

export const createOutletHandler = async (
  req: Request<any, any, TOutletCreateRequest, any>,
  res: Response,
  next: NextFunction
) => {
  let {
    outletAdmin,
    name,
    area,
    mapAddress,
    addressDescription,
    locationLatitude,
    locationLongitude
  } = req.body;

  const { email, phone, password } = outletAdmin;

  try {
    const identifier = email ? "email" : "phone";

    const existingUser = await prisma.user.findFirst({
      where: {
        [identifier]: email ?? phone
      }
    });

    if (existingUser) {
      throw new ApiError(400, undefined, {
        email: `${email ? "Email" : "Phone number"} exist`,
        phone: `${email ? "Email" : "Phone number"} exist`
      });
    }
  } catch (err) {
    next(err);
    return;
  }

  try {
    await prisma.$transaction(async (tx) => {
      if (!mapAddress) {
        mapAddress = await getAddressFromCoordinates(
          locationLatitude,
          locationLongitude
        );
      }

      const mapLink = getGoogleMapLink(locationLatitude, locationLongitude);

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await tx.user.create({
        data: {
          email,
          phone,
          password: hashedPassword,
          role: USER_ROLE.OUTLET_ADMIN,
          outlet: {
            create: {
              name,
              area,
              mapLink,
              mapAddress,
              locationLatitude,
              locationLongitude,
              addressDescription
            }
          }
        },
        include: {
          outlet: true
        }
      });

      const { outlet: _, password: __, ...rest } = user;

      res.status(201).json({
        ...user.outlet,
        outletAdmin: rest
      });
    });
  } catch (err) {
    next(err);
  }
};
