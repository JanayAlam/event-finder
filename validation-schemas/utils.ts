import { z } from "zod";

export const dateOptional = () =>
  z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Invalid date" }
    )
    .transform((val) => {
      if (!val || val === "") return undefined;
      return new Date(val);
    });

export const stringRequired = (label: string) =>
  z
    .string({ message: `${label} is required` })
    .trim()
    .min(1, `${label} is required`);
