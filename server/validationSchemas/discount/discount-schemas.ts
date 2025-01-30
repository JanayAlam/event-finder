import { DISCOUNT_TYPE } from "@prisma/client";
import { z } from "zod";

const DiscountDTOSchema = z.object({
  title: z.string().max(150).optional(),
  discountType: z.nativeEnum(DISCOUNT_TYPE),
  flat: z.coerce.number().min(0).optional(),
  percent: z.coerce.number().min(0).max(100).optional(),
  startsFrom: z
    .string()
    .datetime()
    .default(() => new Date().toISOString()),
  endsAt: z.string().datetime().optional(),
  productIds: z.array(z.string()).min(1)
});

export const DiscountCreateSchema = DiscountDTOSchema.strip().refine(
  (data) => {
    if (data.discountType === DISCOUNT_TYPE.FLAT) {
      return !!data.flat;
    } else {
      return !!data.percent;
    }
  },
  {
    message:
      "Flat discount requires 'flat' value, Percent discount requires 'percent' value",
    path: ["flat", "percent"]
  }
);

export const DiscountCreateParamSchema = z.object({
  outletId: z.string()
});

export const DiscountUpdateSchema = DiscountDTOSchema.strip()
  .partial()
  .refine(
    (data) => {
      if (!data.discountType) {
        return true;
      }

      if (data.discountType === DISCOUNT_TYPE.FLAT) {
        return !!data.flat;
      } else {
        return !!data.percent;
      }
    },
    {
      message:
        "Flat discount requires 'flat' value, Percent discount requires 'percent' value",
      path: ["flat", "percent"]
    }
  );

export const DiscountParamSchema = z.object({
  outletId: z.string(),
  discountId: z.string()
});
