import { z } from "zod";

export const GetAddressFromCoordinatesDTOSchema = z.object({
  latitude: z.number(),
  longitude: z.number()
});
