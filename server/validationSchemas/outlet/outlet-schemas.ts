import { z } from "zod";

export const OutletCreateDTOSchema = z.object({
  outletAdmin: z.object({
    email: z.string().email().max(150).optional(),
    phone: z.string().trim().max(20).optional(),
    password: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters long")
  }),
  name: z.string().trim().min(1).max(150),
  area: z.string().trim().max(150).optional(),
  mapAddress: z.string().trim().max(191).optional(),
  addressDescription: z.string().trim().max(191).optional(),
  locationLongitude: z.number(),
  locationLatitude: z.number()
});

export const GetOutletDTOParamSchema = z.object({
  outletId: z.string().trim()
});

export const GetOutletDTOQuerySchema = z.object({
  outletAdmin: z.string().trim().optional()
});

export const UpdateOutletDTOSchema = z
  .object({
    name: z.string().trim().max(150).optional(),
    area: z.string().trim().max(150).optional(),
    addressDescription: z.string().trim().max(191).optional(),
    mapAddress: z.string().trim().max(191).optional(),
    locationLongitude: z.number().optional(),
    locationLatitude: z.number().optional()
  })
  .strip();

export const UpdateOutletDTOParamSchema = GetOutletDTOParamSchema;
