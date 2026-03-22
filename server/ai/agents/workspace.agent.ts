import { Agent, InputGuardrail, run, RunContext } from "@openai/agents";
import { RECOMMENDED_PROMPT_PREFIX } from "@openai/agents-core/extensions";
import z from "zod";
import { IWorkspaceAgentContext } from "../../../common/types/ai.types";
import { WorkspaceAgentOutputSchema } from "../../../common/validation-schemas";
import { eventCreatorAgent } from "./event-creator.agent";
import { searchAgent } from "./search.agent";

const inputGuardRailAgent = new Agent({
  name: "workspace_input_guardrail_agent",
  model: "gpt-4o-mini",
  instructions:
    "Check if the user is searching trips/events/tours and describing their preferences or want to create trips/events/tours and not doing any other operations.",
  outputType: z.object({
    isValid: z.boolean(),
    reasoning: z.string()
  })
});

const workspaceInputGuardrail: InputGuardrail = {
  name: "workspace_input_guardrail",
  runInParallel: false,
  execute: async ({ input, context: runContext }) => {
    const chats = (runContext as RunContext<IWorkspaceAgentContext> | undefined)
      ?.context.chats;

    const inputWithContext = chats?.length
      ? `${chats.map((c) => c.prompt).join(" ")} ${input}`
      : input;

    const result = await run(inputGuardRailAgent, inputWithContext, {
      context: runContext
    });
    return {
      outputInfo: result.finalOutput,
      tripwireTriggered: result.finalOutput?.isValid === false
    };
  }
};

export const workspaceAgent = new Agent<
  IWorkspaceAgentContext,
  typeof WorkspaceAgentOutputSchema
>({
  name: "workspace_agent",
  instructions: `${RECOMMENDED_PROMPT_PREFIX}
    You are a expert receptionist agent who hand off user queries to 'event_search_agent' and 'event_creator_agent'. DO NOT resolve user query on your own, ALWAYS handoff the requests. Return the values from the agents, if 'event_search_agent' triggers then return 'message' and 'events', if 'event_creator_agent' triggers then return 'message' and 'eventToCreate'.
  `,
  handoffDescription: `
    You are an agent how handoff user request to other agents.
  `,
  inputGuardrails: [workspaceInputGuardrail],
  handoffs: [searchAgent, eventCreatorAgent],
  outputType: WorkspaceAgentOutputSchema
});
