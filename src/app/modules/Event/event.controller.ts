import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import queryPickers from "../../utils/queryPickers";
import { eventFilterableFields } from "./event.constants";
import { eventServices } from "./event.service";

// Create a new event
const createEvent = catchAsync(async (req, res) => {
  const result = await eventServices.createEvent(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event created successfully!",
    data: result,
  });
});

// // Get all events with filters and pagination
// const getEvents = catchAsync(async (req, res) => {
//   const filters = queryPickers(req.query, eventFilterableFields);
//   const options = queryPickers(req.query, [
//     "limit",
//     "page",
//     "sortBy",
//     "sortOrder",
//   ]);

//   const result = await eventServices.getEvents(filters, options);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Events retrieved successfully!",
//     meta: result.meta,
//     data: result.data,
//   });
// });

// // Get a specific event by ID
// const getSingleEvent = catchAsync(async (req, res) => {
//   const { eventId } = req.params;
//   const result = await eventServices.getSingleEvent(eventId);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Event retrieved successfully!",
//     data: result,
//   });
// });

// // Get events created by the authenticated user
// const getMyEvents = catchAsync(async (req, res) => {
//   const { userId } = req.user;
//   const result = await eventServices.getMyEvents(userId);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Your events retrieved successfully!",
//     data: result,
//   });
// });

// // Update an existing event by ID
// const updateEvent = catchAsync(async (req, res) => {
//   const { eventId } = req.params;
//   const result = await eventServices.updateEvent(eventId, req.body);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Event updated successfully!",
//     data: result,
//   });
// });

// // Delete an event by ID
// const deleteEvent = catchAsync(async (req, res) => {
//   const { eventId } = req.params;
//   const result = await eventServices.deleteEvent(eventId);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Event deleted successfully!",
//     data: result,
//   });
// });

// // Add a participant to an event
// const addParticipant = catchAsync(async (req, res) => {
//   const { eventId } = req.params;
//   const { email } = req.body; // Assuming the participant's email is sent in the request body
//   const result = await eventServices.addParticipant(eventId, email);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Participant added successfully!",
//     data: result,
//   });
// });

// // Remove a participant from an event
// const removeParticipant = catchAsync(async (req, res) => {
//   const { eventId, participantId } = req.params;
//   const result = await eventServices.removeParticipant(eventId, participantId);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Participant removed successfully!",
//     data: result,
//   });
// });

export const eventControllers = {
  createEvent,
  // getEvents,
  // getSingleEvent,
  // getMyEvents,
  // updateEvent,
  // deleteEvent,
  // addParticipant,
  // removeParticipant,
};
