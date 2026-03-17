import { run } from "@openai/agents";
import {
  TAIConversationContextItemDto,
  TWorkplaceAgentUserContext
} from "../../common/types/ai.types";
import { eventCreatorAgentWithInputGuardrail } from "./agents/event-creator.agent";
import { workplaceAgent } from "./agents/workplace.agent";

export async function runWorkplaceAgent(
  query: string,
  user?: TWorkplaceAgentUserContext
) {
  const queryWithContext = user
    ? `User Info: ${JSON.stringify(user)}\n\n${query}`
    : query;

  const result = await run(workplaceAgent, queryWithContext);
  return result;
}

export async function runEventCreatorAgent(
  query: string,
  context: {
    conversationHistory: TAIConversationContextItemDto[];
    userInfo?: TWorkplaceAgentUserContext | null;
  } = { conversationHistory: [] }
) {
  const recentHistory = context.conversationHistory.slice(-5);

  let queryWithContext = recentHistory.length
    ? `Previous Conversation Context:
${recentHistory
  .map(
    (item, index) =>
      `${index + 1}. User: ${item.prompt}\n    Assistant: ${item.response}`
  )
  .join("\n")}

Current User Request:
${query}`
    : query;

  if (context.userInfo) {
    queryWithContext += `\n\nUser Info: ${JSON.stringify(context.userInfo)}`;
  }

  const result = await run(
    eventCreatorAgentWithInputGuardrail,
    queryWithContext
  );
  return result;
}
