import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import queryPickers from "../../utils/queryPickers";
import { eventFilterableFields, eventQueryOptions } from "./event.constants";
import { eventServices } from "./event.service";
import APIError from "../../errors/APIError";

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

// Get all events with filters and pagination
const getEvents = catchAsync(async (req, res) => {
  const filters = queryPickers(req.query, eventFilterableFields);
  const options = queryPickers(req.query, eventQueryOptions);

  const result = await eventServices.getEvents(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Events retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// Get a specific event by ID
const getSingleEvent = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const eventIdNumber = parseInt(eventId, 10);
  if (isNaN(eventIdNumber)) {
    throw new APIError(httpStatus.BAD_REQUEST, "Invalid event ID format.");
  }

  const result = await eventServices.getSingleEvent(eventIdNumber);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event retrieved successfully!",
    data: result,
  });
});

// Update an existing event by ID
const updateEvent = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const eventIdNumber = parseInt(eventId, 10);
  if (isNaN(eventIdNumber)) {
    throw new APIError(httpStatus.BAD_REQUEST, "Invalid event ID format.");
  }

  const result = await eventServices.updateEvent(eventIdNumber, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event updated successfully!",
    data: result,
  });
});

// Delete an event by ID
const deleteEvent = catchAsync(async (req, res) => {
  const { eventId } = req.params;

  const eventIdNumber = parseInt(eventId, 10);
  if (isNaN(eventIdNumber)) {
    throw new APIError(httpStatus.BAD_REQUEST, "Invalid event ID format.");
  }

  await eventServices.deleteEvent(eventIdNumber);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event deleted successfully!",
    data: {},
  });
});

// Add a participant to an event
const addParticipant = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const { participants } = req.body;

  const eventIdNumber = parseInt(eventId, 10);
  if (isNaN(eventIdNumber)) {
    throw new APIError(httpStatus.BAD_REQUEST, "Invalid event ID format.");
  }

  const result = await eventServices.addParticipant({
    eventIdNumber,
    participants,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Participant added successfully!",
    data: result,
  });
});

// Remove a participant from an event
const removeParticipant = catchAsync(async (req, res) => {
  const { eventId, participantId } = req.params;

  const eventIdNumber = parseInt(eventId, 10);
  if (isNaN(eventIdNumber)) {
    throw new APIError(httpStatus.BAD_REQUEST, "Invalid event ID format.");
  }

  const participantIdNumber = parseInt(participantId, 10);
  if (isNaN(participantIdNumber)) {
    throw new APIError(
      httpStatus.BAD_REQUEST,
      "Invalid participant ID format."
    );
  }

  await eventServices.removeParticipant({
    eventIdNumber,
    participantIdNumber,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Participant removed successfully!",
    data: {},
  });
});

export const eventControllers = {
  createEvent,
  getEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
  addParticipant,
  removeParticipant,
};
