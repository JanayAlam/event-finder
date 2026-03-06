import { run } from "@openai/agents";
import { TAIConversationContextItemDto } from "../../common/types/ai.types";
import { eventCreatorAgent } from "./agents/event-creator.agent";
import { searchAgent } from "./agents/search.agent";

export default async function runEventSearchAgent(query: string) {
  const result = await run(searchAgent, query);
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

  const result = await run(eventCreatorAgent, contextBlock);
  return result;
}
