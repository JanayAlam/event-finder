import { tool } from "@openai/agents";
import { TAISearchEventResponse } from "../../../common/types/ai.types";
import { EventSearchToolSchema } from "../../../common/validation-schemas";
import AIUseCase from "../../libs/use-cases/ai.use-case";
import logger from "../../utils/winston.util";

export const getEventsTool = tool({
  name: "get_events",
  description: "Get the events for a given search prompt",
  parameters: EventSearchToolSchema,
  async execute(params): Promise<TAISearchEventResponse> {
    try {
      const events = await AIUseCase.searchEvents(params);
      return {
        message: events.length ? "Events found" : "Events not found",
        events
      };
    } catch (err) {
      logger.error("Error in getEventsTool", err);
      return { message: "Events not found", events: [] };
    }
  }
});
