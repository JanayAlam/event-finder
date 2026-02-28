import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp"
];
const ACCEPTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

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
      if (typeof files === "string" || !files) return;

      const isFileList =
        typeof FileList !== "undefined" && files instanceof FileList;
      const file = isFileList ? (files as FileList)[0] : files;

      if (!file || typeof file !== "object" || !("size" in file)) return;

      if (file.size > MAX_FILE_SIZE) {
        ctx.addIssue({
          code: "custom",
          message: "Max image size is 5MB"
        });
      }

      const fileType = file.type;
      const fileName = file.name?.toLowerCase() || "";
      const hasValidType = ACCEPTED_IMAGE_TYPES.includes(fileType);
      const hasValidExt = ACCEPTED_EXTENSIONS.some((ext) =>
        fileName.endsWith(ext)
      );

      if (!hasValidType && !hasValidExt) {
        ctx.addIssue({
          code: "custom",
          message: "Only .jpg, .jpeg, .png and .webp formats are supported"
        });
      }
    })
    .transform((files) => {
      if (typeof files === "string") return files;
      if (typeof FileList !== "undefined" && files instanceof FileList) {
        return files[0];
      }
      return files;
    });
