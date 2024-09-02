import express from "express";
import { eventControllers } from "./event.controller";
import validateRequest from "../../middlewares/validateRequest";
// import { eventValidationSchemas } from "./event.validation";

const router = express.Router();

// Get all events with pagination and query params
router.get("/events", eventControllers.getEvents);

// Get details of a specific event by ID
router.get("/events/:eventId", eventControllers.getSingleEvent);

// Create a new event
router.post(
  "/events",
  // validateRequest(eventValidationSchemas.createEventSchema),
  eventControllers.createEvent
);

// Update an event by ID
router.put(
  "/events/:eventId",
  // validateRequest(eventValidationSchemas.updateEventSchema),
  eventControllers.updateEvent
);

// Delete an event by ID
router.delete("/events/:eventId", eventControllers.deleteEvent);

// Add participants to an event
router.post(
  "/events/:eventId/participants",
  // validateRequest(eventValidationSchemas.addParticipantSchema),
  eventControllers.addParticipant
);

// // Remove a participant from an event
// router.delete(
//   "/events/:eventId/participants/:participantId",
//   auth(UserRole.ADMIN, UserRole.USER),
//   eventControllers.removeParticipant
// );

export const eventRoutes = router;
