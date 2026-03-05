import { run } from "@openai/agents";
import { eventCreatorAgent } from "./agents/event-creator.agent";
import { searchAgent } from "./agents/search.agent";

export default async function runEventSearchAgent(query: string) {
  const result = await run(searchAgent, query);
  return result;
}

export async function runEventCreatorAgent(query: string) {
  const result = await run(eventCreatorAgent, query);
  return result;
}
