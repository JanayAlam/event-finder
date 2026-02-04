import { z } from "zod";
import { dateOptional, stringRequired } from "./utils";

export const PersonalInfoRequestSchema = z.object({
  firstName: stringRequired("Given name").max(
    20,
    "Given name cannot be longer than 20 characters"
  ),
  lastName: stringRequired("Family name").max(
    15,
    "Family name cannot be longer than 15 characters"
  ),
  dateOfBirth: dateOptional().refine(
    (date) => {
      if (!date) return true;
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      return date <= eighteenYearsAgo;
    },
    { message: "You must be at least 18 years old" }
  )
});

export type TPersonalInfoRequestDto = z.infer<typeof PersonalInfoRequestSchema>;
