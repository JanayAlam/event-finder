import { z } from "zod";
import { TUserRole } from "../../server/enums";
import {
  AIEventCreationSchema,
  EventCreatorAgentOutputSchema,
  EventSearchToolSchema,
  PromptSchema,
  SearchAgentEventSchema,
  SearchAgentOutputSchema,
  WorkspaceAgentOutputSchema
} from "../validation-schemas/ai.schemas";

export type TPromptRequestDto = z.infer<typeof PromptSchema>;

export type TEventSearchToolDto = z.infer<typeof EventSearchToolSchema>;

export type TAISearchEvent = z.infer<typeof SearchAgentEventSchema>;

export type TAISearchEventResponse = z.infer<typeof SearchAgentOutputSchema>;

export type TAIWorkspacePromptResponse = z.infer<
  typeof WorkspaceAgentOutputSchema
>;

export type TAIEventCreationSchemaDto = z.infer<typeof AIEventCreationSchema>;

export type TAIConversationContextItemDto = NonNullable<
  TAIEventCreationSchemaDto["conversationHistory"]
>[number];

export type TGenerateEventPlanResponse = z.infer<
  typeof EventCreatorAgentOutputSchema
>;

export type TWorkspaceAgentUserContext = { name: string; role: TUserRole };
