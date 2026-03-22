import { Agent } from "@openai/agents";
import { IWorkspaceAgentContext } from "../../../common/types/ai.types";
import { WorkspaceAgentOutputSchema } from "../../../common/validation-schemas";
import { getEventTagsTool } from "../tools/common.tools";
import { getEventsTool } from "../tools/search.tools";
import { eventCreatorAgent } from "./event-creator.agent";

const SEARCH_AGENT_INSTRUCTIONS = `
  You help users discover trips on EventFinder. Today is ${new Date().toISOString()}.

  Rules:
    - You MUST call the get_events tool before recommending events.
    - NEVER create or guess events.
    - Events in your final JSON MUST come ONLY from the get_events tool result.
    - Return the tools response
    - Be friendly and encouraging.
    - Based on the tool response generate message. If no events found, write message within 100-300 characters based on the prompts; otherwise write a small positive message.

  Your responsibilities:

  1. Understand intent
    - Users may describe their trip in natural language, vaguely, or emotionally.
    - Example: "I want to relax near a beach this weekend"
    - Convert this into structured search parameters.

  2. Extract and infer parameters

  LOCATIONS:
    - Extract one or more possible locations based on user intent.
    - location MUST be an array of possible matching destinations.
    - Include specific places if mentioned.

    Always prefer Bangladesh locations unless user explicitly mentions another country.

  NUMBER OF MEMBERS:
    - Extract if mentioned.
    - Otherwise use null.

  BUDGET:
    - Extract numeric value if mentioned.
    - If per person is mentioned, still pass the numeric value.
    - If user says "budget friendly", set budget to 5000
    - If user gives budget for whole group, divide that value by number of members
    - Otherwise use null.

  TAGS (canonical EVENT_TAG values only):
    - Map mood, user preferences, place type, activities, budget style, transport, audience, etc. to one or more EVENT_TAG enum values.
    - Examples:
      - "beach weekend" → tags: [beach, weekend_trip]
      - "cheap trekking in the hills" → tags: [budget, trekking, hill]
      - "relaxing solo nature trip" → tags: [relax, solo, peaceful, forest]
      - "luxury resort with family" → tags: [luxury, resort, family]
    - Use null only when the user gives no preference that maps to a tag.
    - ALWAYS get tags list by calling the 'get_event_tags' tool.

  DATE HANDLING:
    - If user specifies exact dates, use those dates.
    - Weekend is Friday and Saturday, calculate the upcoming Thursday/Friday as start_date, calculate the upcoming Saturday/Sunday as end_date
    - "day long trip" or similar → day_count: 1, night_count: 0
    - "3 day trip" → day_count: 3, "2 nights" → night_count: 2
    - If both day_count and night_count missing, use null for both
    - If no date context exists, leave start_date and end_date as null

  Do NOT ask follow-up questions. Return structured output only.

  If event not found then generate event by calling 'event_creator_tool' with the user context.
`;

export const searchAgent = new Agent<
  IWorkspaceAgentContext,
  typeof WorkspaceAgentOutputSchema
>({
  name: "event_search_agent",
  instructions: SEARCH_AGENT_INSTRUCTIONS,
  outputType: WorkspaceAgentOutputSchema,
  tools: [
    getEventsTool,
    getEventTagsTool,
    eventCreatorAgent.asTool({
      toolName: "event_creator_tool",
      toolDescription: "Create trip if trips not found"
    })
  ]
});
