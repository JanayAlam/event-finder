import { Outlet } from "@prisma/client";
import { prisma } from "../../db";
import { TUpdateOutletRequest } from "../../types/outlet";
import { getAddressFromCoordinates } from "../google-map";

export const updateOutletInfo = async (
  data: TUpdateOutletRequest,
  existingOutlet: Outlet
) => {
  if (!data.mapAddress && (data.locationLatitude || data.locationLongitude)) {
    data.mapAddress = await getAddressFromCoordinates(
      data.locationLatitude || existingOutlet.locationLatitude,
      data.locationLongitude || existingOutlet.locationLongitude
    );
  }

  return prisma.outlet.update({
    where: { id: existingOutlet.id },
    data: data
  });
};
