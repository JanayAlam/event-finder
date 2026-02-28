import { z } from "zod";
import {
  EventSearchToolSchema,
  PromtScheam,
  SearchAgentEventSchema,
  SearchAgentOutputSchema
} from "../validation-schemas/ai.schemas";

export type TPromtRequestDto = z.infer<typeof PromtScheam>;

export type TEventSearchToolDto = z.infer<typeof EventSearchToolSchema>;

export type TAISearchEvent = z.infer<typeof SearchAgentEventSchema>;

export type TAIPromtResponse = z.infer<typeof SearchAgentOutputSchema>;
