import { tool } from "@openai/agents";
import { GenerateEventToolSchema } from "../../../common/validation-schemas";

export const calculateTripDurationTool = tool({
  name: "calculate_trip_duration",
  description:
    "Calculates the exact number of days and nights for a trip, given the start and end dates. Use this tool before generating the final JSON to ensure accurate dayCount and nightCount.",
  parameters: GenerateEventToolSchema,
  async execute({ start_date, end_date }) {
    try {
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return {
          message: "Invalid date format provided. Need valid date string.",
          dayCount: 1,
          nightCount: 0
        };
      }

      const diffInMs = endDate.getTime() - startDate.getTime();
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

      const dayCount = Math.max(1, diffInDays);
      const nightCount = Math.max(0, diffInDays - 1);

      return {
        message: "Duration calculated successfully",
        dayCount,
        nightCount,
        eventDate: startDate.toISOString()
      };
    } catch (_err) {
      return {
        message: "Error calculating duration",
        dayCount: 1,
        nightCount: 0
      };
    }
  }
});
