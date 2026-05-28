import { tool } from "@openai/agents";
import z from "zod";
import { eventTags } from "../../enums";

export const getEventTagsTool = tool({
  name: "get_event_tags",
  description: "Get all available tags for events",
  parameters: z.object({}),
  async execute() {
    return {
      tags: eventTags
    };
  }
});
