import { run } from "@openai/agents";
import { TAIConversationContextItemDto } from "../../common/types/ai.types";
import { eventCreatorAgentWithInputGuardrail } from "./agents/event-creator.agent";
import { workplaceAgent } from "./agents/event-finder-workplace.agent";

export async function runWorkplaceAgent(query: string) {
  const result = await run(workplaceAgent, query);
  return result;
}

export async function runEventCreatorAgent(
  query: string,
  conversationHistory: TAIConversationContextItemDto[] = []
) {
  const recentHistory = conversationHistory.slice(-5);

  const contextBlock = recentHistory.length
    ? `Previous Conversation Context:
${recentHistory
  .map(
    (item, index) =>
      `${index + 1}. User: ${item.prompt}\n   Assistant: ${item.response}`
  )
  .join("\n")}

Current User Request:
${query}`
    : query;

  const result = await run(eventCreatorAgentWithInputGuardrail, contextBlock);
  return result;
}
