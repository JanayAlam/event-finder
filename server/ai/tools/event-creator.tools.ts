import { tool } from "@openai/agents";
import { GenerateEventToolSchema } from "../../../common/validation-schemas";

export const calculateEventDurationTool = tool({
  name: "calculate_event_duration",
  description:
    "Calculates canonical eventDate, endDate, dayCount, and nightCount from trip dates",
  parameters: GenerateEventToolSchema,
  async execute({ start_date, end_date }) {
    try {
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);

      const hasValidStart = !isNaN(startDate.getTime());
      const hasValidEnd = !isNaN(endDate.getTime());

      const diffInMs =
        hasValidStart && hasValidEnd
          ? endDate.getTime() - startDate.getTime()
          : 0;
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
      const finalDayCount = Math.max(1, diffInDays || 1);
      const finalNightCount = Math.max(0, finalDayCount - 1);

      return {
        message: "Duration calculated successfully",
        dayCount: finalDayCount,
        nightCount: finalNightCount,
        eventDate: hasValidStart ? startDate.toISOString() : start_date,
        endDate: hasValidEnd ? endDate.toISOString() : end_date
      };
    } catch {
      return {
        message: "Error calculating duration",
        dayCount: 1,
        nightCount: 0,
        eventDate: start_date,
        endDate: end_date
      };
    }
  }
});
