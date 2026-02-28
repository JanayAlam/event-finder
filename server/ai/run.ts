import { run } from "@openai/agents";
import { searchAgent } from "./agents/search.agent";

export default async function runEventSearchAgent(query: string) {
  const result = await run(searchAgent, query);
  return result;
}
