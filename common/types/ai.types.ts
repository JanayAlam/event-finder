import { z } from "zod";
import {
  AIEventCreationSchema,
  EventCreatorAgentOutputSchema,
  EventSearchToolSchema,
  PromtScheam,
  SearchAgentEventSchema,
  SearchAgentOutputSchema
} from "../validation-schemas/ai.schemas";

export type TPromtRequestDto = z.infer<typeof PromtScheam>;

export type TEventSearchToolDto = z.infer<typeof EventSearchToolSchema>;

export type TAISearchEvent = z.infer<typeof SearchAgentEventSchema>;

export type TAIPromtResponse = z.infer<typeof SearchAgentOutputSchema>;

export interface IAIQueryItem {
  key: string;
  prompt: string;
  result?: TAIPromtResponse;
  isLoading: boolean;
}

export type TAIEventCreationSchemaDto = z.infer<typeof AIEventCreationSchema>;

export type TGenerateEventPlanResponse = z.infer<
  typeof EventCreatorAgentOutputSchema
>;
