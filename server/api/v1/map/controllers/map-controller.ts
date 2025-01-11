import { AxiosError } from "axios";
import { NextFunction, Request, Response } from "express";
import { getAddressFromCoordinates } from "../../../../services/google-map";
import { TGetAddressFromCoordinatesRequest } from "../../../../types/map";

export const reverseGeocodeHandler = async (
  req: Request<any, any, TGetAddressFromCoordinatesRequest, any>,
  res: Response,
  next: NextFunction
) => {
  let { latitude, longitude } = req.body;

  try {
    const address = await getAddressFromCoordinates(latitude, longitude);

    res.status(200).json({
      address
    });
  } catch (err) {
    if (err instanceof AxiosError && err.status === 400) {
      res.status(400).json({
        latitude: "Invalid latitude or longitude value",
        longitude: "Invalid latitude or longitude value"
      });
      return;
    }
    next(err);
  }
};
