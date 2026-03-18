import { run } from "@openai/agents";
import {
  IWorkspaceAgentUserContext,
  TAIConversationContextItemDto
} from "../../common/types/ai.types";
import { eventCreatorAgentWithInputGuardrail } from "./agents/event-creator.agent";
import { workspaceAgent } from "./agents/workspace.agent";

export async function runWorkspaceAgent(
  query: string,
  user?: IWorkspaceAgentUserContext
) {
  const result = await run(workspaceAgent, query, {
    context: user
  });
  return result;
}

export async function runEventCreatorAgent(
  query: string,
  context: {
    conversationHistory: TAIConversationContextItemDto[];
    userInfo?: IWorkspaceAgentUserContext | null;
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
