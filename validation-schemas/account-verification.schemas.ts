import { z } from "zod";
import { imageOptional, stringOptional } from "./utils";

export const accountVerificationSchema = z.object({
  nidNumber: stringOptional(),
  nidFrontImage: imageOptional(),
  nidBackImage: imageOptional(),
  passportNumber: stringOptional(),
  passportImage: imageOptional()
});
