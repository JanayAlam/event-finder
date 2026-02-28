import { Agent } from "@openai/agents";
import { SearchAgentOutputSchema } from "../../../common/validation-schemas";
import { getEventsTool } from "../tools/search.tools";
import { searchAgentInstructions } from "./instructions/search.agent.instructions";

export const searchAgent = new Agent({
  name: "search_agent",
  instructions: searchAgentInstructions,
  outputType: SearchAgentOutputSchema,
  tools: [getEventsTool]
});
