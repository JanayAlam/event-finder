import { z } from "zod";
import {
  AIEventCreationSchema,
  EventCreatorAgentOutputSchema,
  EventSearchToolSchema,
  PromptSchema,
  SearchAgentEventSchema,
  SearchAgentOutputSchema
} from "../validation-schemas/ai.schemas";

export type TPromptRequestDto = z.infer<typeof PromptSchema>;

export type TEventSearchToolDto = z.infer<typeof EventSearchToolSchema>;

export type TAISearchEvent = z.infer<typeof SearchAgentEventSchema>;

export type TAIPromptResponse = z.infer<typeof SearchAgentOutputSchema>;

export interface IAIQueryItem {
  key: string;
  prompt: string;
  result?: TAIPromptResponse;
  isLoading: boolean;
}

export type TAIEventCreationSchemaDto = z.infer<typeof AIEventCreationSchema>;

export type TGenerateEventPlanResponse = z.infer<
  typeof EventCreatorAgentOutputSchema
>;
