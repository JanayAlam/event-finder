import { Agent } from "@openai/agents";
import { SearchAgentOutputSchema } from "../../../common/validation-schemas";
import { getEventsTool } from "../tools/search.tools";
import { eventCreatorAgentInstructions } from "./instructions/event-creator.agent.instructions";

export const searchAgent = new Agent({
  name: "tripmate_event_creator_agent",
  instructions: eventCreatorAgentInstructions,
  outputType: SearchAgentOutputSchema,
  tools: [getEventsTool]
});
