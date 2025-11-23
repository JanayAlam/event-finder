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
  dateOfBirth: dateOptional()
});
