import { z } from "zod";

export const PromtScheam = z.object({
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

export const AiEventCreationSchema = z
  .object({
    place: z.string().min(1, "Place is required"),
    when: z.string().min(1, "Departure time is required"),
    back: z.string().min(1, "Return time is required")
  })
  .refine((data) => new Date(data.back) > new Date(data.when), {
    message: "Return time must be after departure time",
    path: ["back"]
  });
