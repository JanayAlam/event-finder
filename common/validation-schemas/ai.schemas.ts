import { z } from "zod";

export const PromptSchema = z.object({
  prompt: z.string().min(1, "Prompt is required")
});

export const EventSearchToolSchema = z.object({
  locations: z.array(z.string()).describe("Possible trip/event locations"),
  number_of_members: z
    .number()
    .describe("Number of members needed to be available in the event")
    .nullable(),
  start_date: z.string().describe("Start date of the trip").nullable(),
  end_date: z.string().describe("End date of the trip").nullable(),
  budget: z.number().describe("Budget for the trip").nullable(),
  day_count: z
    .number()
    .describe("Number of days required to be available in the event")
    .nullable(),
  night_count: z
    .number()
    .describe("Number of nights required to be available in the event")
    .nullable()
});

export const SearchAgentEventSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  placeName: z.string(),
  eventDate: z.string(),
  entryFee: z.number(),
  dayCount: z.number(),
  nightCount: z.number(),
  memberCapacity: z.number().nullable(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const SearchAgentOutputSchema = z.object({
  message: z.string().max(300),
  events: z.array(SearchAgentEventSchema).default([])
});

export const AIEventCreationSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  conversationHistory: z
    .array(
      z.object({
        prompt: z.string().min(1),
        response: z.string().min(1)
      })
    )
    .max(10)
    .optional()
});

export const GenerateEventToolSchema = z.object({
  start_date: z
    .string()
    .describe("Departure time provided by user in any readable format"),
  end_date: z
    .string()
    .describe("Return/end time provided by user in any readable format")
});

const EventToCreateSchema = z.object({
  title: z.string().describe("Catchy title for the trip"),
  placeName: z.string().describe("Destination place name"),
  description: z
    .string()
    .describe(
      "Vivid description of the trip highlighting what to expect, and explicitly mention the trip end date"
    ),
  eventDate: z.string().describe("Departure time of the trip in ISO format"),
  dayCount: z.number().describe("Total number of days the trip lasts"),
  nightCount: z.number().describe("Total number of nights the trip lasts"),
  entryFee: z
    .number()
    .describe(
      "Estimated budget/entry fee in BDT. Make a realistic guess based on the place and duration. Default roughly 5000."
    ),
  memberCapacity: z
    .number()
    .describe("Suggested member capacity for this event, e.g. 10 to 30"),
  itinerary: z
    .array(
      z.object({
        moment: z
          .string()
          .describe("Date/time for this itinerary step in ISO format"),
        title: z.string().describe("Short title of the activity or day"),
        description: z
          .string()
          .describe("Detailed description of activities during this phase")
      })
    )
    .describe("Detailed day-by-day or event-by-event itinerary of the trip")
});

export const EventCreatorAgentOutputSchema = z.object({
  message: z.string().max(300),
  eventToCreate: EventToCreateSchema
});

export const WorkplaceAgentOutputSchema = z.object({
  message: z.string().max(300),
  events: z.array(SearchAgentEventSchema).optional(),
  eventToCreate: EventToCreateSchema.clone().optional()
});

export const GuardrailOutputSchema = z.object({
  isValid: z.boolean(),
  reasoning: z.string()
});
