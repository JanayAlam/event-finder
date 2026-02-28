import { z } from "zod";
import { stringRequired } from "./utils";

export const CreateEventSchema = z.object({
  title: stringRequired("Event title").max(
    100,
    "Event title cannot be longer than 100 characters"
  ),
  description: stringRequired("Event description").max(
    1000,
    "Event description cannot be longer than 1000 characters"
  ),
  placeName: stringRequired("Place name").max(
    100,
    "Place name cannot be longer than 100 characters"
  ),
  eventDate: z
    .string({
      message: "Event date is required"
    })
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date > new Date();
      },
      { message: "Event date must be a valid future date" }
    )
    .transform((val) => new Date(val)),
  entryFee: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : val),
    z.coerce
      .number({
        error: "Entry fee is required"
      })
      .min(0, "Entry fee cannot be negative")
  ),
  dayCount: z.coerce
    .number({ message: "Number of days count must be a number" })
    .min(1, "Number of days count must be at least 1")
    .default(1),
  nightCount: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : val),
    z.coerce
      .number({
        error: "Number of nights is required"
      })
      .min(0, "Number of nights cannot be negative")
  ),
  memberCapacity: z.coerce
    .number({ message: "Member capacity must be a number" })
    .min(0, "Member capacity should be positive")
    .optional(),
  itinerary: z
    .array(
      z.object({
        moment: z
          .string({ message: "Moment must be a valid date string" })
          .refine(
            (val) => {
              const date = new Date(val);
              return !isNaN(date.getTime());
            },
            { message: "Invalid date format for moment" }
          )
          .transform((val) => new Date(val)),
        title: stringRequired("Itinerary title").max(
          100,
          "Itinerary title cannot be longer than 100 characters"
        ),
        description: z
          .string()
          .trim()
          .max(
            500,
            "Itinerary description cannot be longer than 500 characters"
          )
          .optional()
      })
    )
    .optional()
    .default([]),
  coverPhoto: z.string().optional(),
  additionalPhotos: z
    .array(z.object({ path: z.string() }))
    .default([])
    .transform((items) => items.map((i) => i.path))
});

export const UpdateEventSchema = CreateEventSchema.partial();

export const SearchSchema = z.object({
  search: stringRequired("Search").max(
    100,
    "Search cannot be longer than 100 characters"
  )
});
