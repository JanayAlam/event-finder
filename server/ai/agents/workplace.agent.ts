import { Agent, InputGuardrail, run } from "@openai/agents";
import { RECOMMENDED_PROMPT_PREFIX } from "@openai/agents-core/extensions";
import z from "zod";
import { WorkplaceAgentOutputSchema } from "../../../common/validation-schemas";
import { eventCreatorAgent } from "./event-creator.agent";
import { searchAgent } from "./search.agent";

const inputGuardRailAgent = new Agent({
  name: "workplace_input_guardrail_agent",
  model: "gpt-4o-mini",
  instructions:
    "Check if the user is searching trips or want to create trips and not doing any other operations.",
  outputType: z.object({
    isValid: z.boolean(),
    reasoning: z.string()
  })
});

const workplaceInputGuardrail: InputGuardrail = {
  name: "workplace_input_guardrail",
  runInParallel: false,
  execute: async ({ input, context }) => {
    const result = await run(inputGuardRailAgent, input, { context });
    return {
      outputInfo: result.finalOutput,
      tripwireTriggered: result.finalOutput?.isValid === false
    };
  }
};

export const workplaceAgent = new Agent({
  name: "workplace_agent",
  instructions: `${RECOMMENDED_PROMPT_PREFIX}
    You are a expert receptionist agent who hand off user queires to 'event_search_agent' and 'event_creator_agent'. DO NOT resolve user query on your own, ALWAYS handoff the requests. Return the values from the agents, if 'event_search_agent' triggers then return 'message' and 'events', if 'event_creator_agent' triggers then return 'message' and 'eventToCreate'.
  `,
  handoffDescription: `
    You are an agent how handoff user request to other agents.
  `,
  inputGuardrails: [workplaceInputGuardrail],
  handoffs: [searchAgent, eventCreatorAgent],
  outputType: WorkplaceAgentOutputSchema
});
