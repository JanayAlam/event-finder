import { z } from "zod";
import { OutletAdminCreateDTOSchema } from "../admin";

export const OutletCreateDTOSchema = z.object({
  outletAdmin: OutletAdminCreateDTOSchema,
  name: z.string().trim().min(1).max(150),
  area: z.string().trim().min(1).max(150).optional(),
  addressDescription: z.string().trim().min(1).max(191).optional(),
  locationLongitude: z.number(),
  locationLatitude: z.number()
});

export const GetOutletDTOParamSchema = z.object({
  outletId: z.string().trim()
});

export const GetOutletDTOQuerySchema = z.object({
  outletAdmin: z.string().trim().optional()
});
