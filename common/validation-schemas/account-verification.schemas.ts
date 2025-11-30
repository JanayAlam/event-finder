import { z } from "zod";
import { imageOptional, stringOptional } from "./utils";

export const AccountVerificationSchema = z
  .object({
    nidNumber: stringOptional(),
    nidFrontImage: imageOptional(),
    nidBackImage: imageOptional(),
    passportNumber: stringOptional(),
    passportImage: imageOptional()
  })
  .refine(
    (data) => {
      const hasAllPassportFields = data.passportNumber && data.passportImage;
      return !hasAllPassportFields ? !!data.nidFrontImage : true;
    },
    {
      message: "Font side image is required for NID verification",
      path: ["nidFrontImage"]
    }
  )
  .refine(
    (data) => {
      const hasAllPassportFields = data.passportNumber && data.passportImage;
      return !hasAllPassportFields ? !!data.nidBackImage : true;
    },
    {
      message: "Back side image is required for NID verification",
      path: ["nidBackImage"]
    }
  )
  .refine(
    (data) => {
      const hasAllPassportFields = data.passportNumber && data.passportImage;
      return !hasAllPassportFields ? !!data.nidNumber : true;
    },
    {
      message: "NID number is required for NID verification",
      path: ["nidNumber"]
    }
  )
  .refine(
    (data) => {
      const hasAllNidFields =
        data.nidNumber && data.nidFrontImage && data.nidBackImage;
      return !hasAllNidFields ? !!data.passportImage : true;
    },
    {
      message: "Passport image is required for passport verification",
      path: ["passportImage"]
    }
  )
  .refine(
    (data) => {
      const hasAllNidFields =
        data.nidNumber && data.nidFrontImage && data.nidBackImage;
      return !hasAllNidFields ? !!data.passportNumber : true;
    },
    {
      message: "Passport number is required for passport verification",
      path: ["passportNumber"]
    }
  );

export const InitiateAccountVerificationApiSchema =
  AccountVerificationSchema.pick({
    nidNumber: true,
    passportNumber: true
  });

export type TInitiateAccountVerificationRequestDto = z.infer<
  typeof InitiateAccountVerificationApiSchema
>;
