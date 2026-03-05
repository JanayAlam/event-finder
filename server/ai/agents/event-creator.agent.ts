import { Agent } from "@openai/agents";
import { EventCreatorAgentOutputSchema } from "../../../common/validation-schemas";
import { calculateTripDurationTool } from "../tools/event-creator.tools";
import { eventCreatorAgentInstructions } from "./instructions/event-creator.agent.instructions";

export const eventCreatorAgent = new Agent({
  name: "tripmate_event_creator_agent",
  instructions: eventCreatorAgentInstructions,
  outputType: EventCreatorAgentOutputSchema,
  tools: [calculateTripDurationTool]
});
