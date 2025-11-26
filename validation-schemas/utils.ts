import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp"
];

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

export const stringOptional = () => z.string().trim().optional();

export const stringRequired = (label: string) =>
  z
    .string({ message: `${label} is required` })
    .trim()
    .min(1, `${label} is required`);

export const imageOptional = () =>
  z
    .any()
    .optional()
    .superRefine((files, ctx) => {
      const file = files?.[0];

      if (!file) return;

      if (file.size > MAX_FILE_SIZE) {
        ctx.addIssue({
          code: "custom",
          message: "Max image size is 5MB"
        });
      }

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        ctx.addIssue({
          code: "custom",
          message: "Only .jpg, .jpeg, .png and .webp formats are supported"
        });
      }
    })
    .transform((files) => files?.[0]);
