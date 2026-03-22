import { run } from "@openai/agents";
import {
  IWorkspaceAgentUserContext,
  TAIConversationContextItemDto
} from "../../common/types/ai.types";
import { eventCreatorAgentWithInputGuardrail } from "./agents/event-creator.agent";
import { workspaceAgent } from "./agents/workspace.agent";
import { ChatConversationShortMemory } from "./memory/chat-conversation-short-memory";

export async function runWorkspaceAgent(
  query: string,
  userContext?: IWorkspaceAgentUserContext
) {
  const chatsContext = ChatConversationShortMemory.getInstance().get();

  const queryWithContext = chatsContext.length
    ? `Previous Conversation Context:
${chatsContext.map((c) => `User: ${c.prompt} \t Assistant: ${JSON.stringify(c.output)}`).join("\n")}

Current User Request:
${query}
`
    : query;

  const result = await run(workspaceAgent, queryWithContext, {
    context: { user: userContext, chats: chatsContext }
  });

  if (result.finalOutput) {
    ChatConversationShortMemory.getInstance().add({
      prompt: query,
      output: result.finalOutput
    });
  }

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
