import { z } from "zod";

// Schema for creating an event
const createEventSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Event name is required",
    }),
    date: z.string({ required_error: "Date is required" }),
    startTime: z.string({
      required_error: "Start time is required",
    }),
    endTime: z.string({
      required_error: "End time is required",
    }),
    location: z.string({
      required_error: "Location is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
  }),
});

// Schema for updating an event
const updateEventSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    date: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
  }),
});

// Schema for adding a participant to an event
const addParticipantSchema = z.object({
  body: z.object({
    participants: z.array(
      z.string().email({
        message: "Each participant must have a valid email address",
      })
    ),
  }),
});

export const eventValidationSchemas = {
  createEventSchema,
  updateEventSchema,
  addParticipantSchema,
};
