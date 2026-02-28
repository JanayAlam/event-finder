import { z } from "zod";
import { PromtScheam } from "../validation-schemas/ai.schemas";

export type TPromtRequestDto = z.infer<typeof PromtScheam>;
