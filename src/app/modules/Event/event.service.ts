import { Event, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";
import { eventSearchableFields } from "./event.constants";
import moment from "moment";
import {
  TAddParticipant,
  TCreateEventData,
  TRemoveParticipant,
  TUpdateEventData,
} from "./event.interface";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";

const createEvent = async (eventData: TCreateEventData): Promise<Event> => {
  const {
    name,
    date,
    startTime,
    endTime,
    location,
    description,
    participants = [],
  } = eventData;

  // Validate date and time formats
  if (!moment(date, "YYYY-MM-DD", true).isValid()) {
    throw new APIError(
      httpStatus.NOT_ACCEPTABLE,
      "Invalid date format. Please use YYYY-MM-DD."
    );
  }
  if (
    !moment(startTime, "HH:mm", true).isValid() ||
    !moment(endTime, "HH:mm", true).isValid()
  ) {
    throw new APIError(
      httpStatus.NOT_ACCEPTABLE,
      "Invalid time format. Please use HH:mm."
    );
  }
  if (!moment(startTime, "HH:mm").isBefore(moment(endTime, "HH:mm"))) {
    throw new APIError(
      httpStatus.NOT_ACCEPTABLE,
      "Start time must be before end time."
    );
  }

  // Check for time conflicts with other events at the same location
  const conflictingEvent = await prisma.event.findFirst({
    where: {
      location,
      date: moment(date).toDate(),
      AND: [
        {
          OR: [
            // Existing event starts before the new event ends
            {
              startTime: { lte: moment(endTime, "HH:mm").format("HH:mm") },
              endTime: { gte: moment(startTime, "HH:mm").format("HH:mm") },
            },
            // Existing event ends after the new event starts
            {
              startTime: { gte: moment(startTime, "HH:mm").format("HH:mm") },
              endTime: { lte: moment(endTime, "HH:mm").format("HH:mm") },
            },
            // New event starts during an existing event
            {
              startTime: { lte: moment(startTime, "HH:mm").format("HH:mm") },
              endTime: { gte: moment(startTime, "HH:mm").format("HH:mm") },
            },
            // New event ends during an existing event
            {
              startTime: { lte: moment(endTime, "HH:mm").format("HH:mm") },
              endTime: { gte: moment(endTime, "HH:mm").format("HH:mm") },
            },
          ],
        },
      ],
    },
  });

  if (conflictingEvent) {
    throw new APIError(
      httpStatus.CONFLICT,
      "Time conflict with another event at the same location."
    );
  }

  if (conflictingEvent) {
    throw new APIError(
      httpStatus.CONFLICT,
      "Time conflict with another event at the same location."
    );
  }

  // Use a transaction to create the event and participants together
  const newEvent = await prisma.$transaction(async (tx) => {
    // Step 1: Create the event
    const createdEvent = await tx.event.create({
      data: {
        name,
        date: moment(date).toDate(),
        startTime,
        endTime,
        location,
        description,
      },
    });

    // Step 2: Upsert participants and link them to the created event
    await Promise.all(
      participants.map(async (email: string) => {
        await tx.participant.create({
          data: {
            email,
            event: {
              connect: { id: createdEvent.id },
            },
          },
        });
      })
    );

    // Return the created event
    return createdEvent;
  });

  return newEvent;
};

// Get all events with optional filters and pagination
const getEvents = async (params: any, options: TPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, eventDate, location, ...filterData } = params;

  const andConditions: Prisma.EventWhereInput[] = [];

  // Exclude deleted events
  andConditions.push({
    isDeleted: false,
  });

  // Search term conditions
  if (searchTerm) {
    andConditions.push({
      OR: eventSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Additional filters
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.EventWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.event.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      name: true,
      date: true,
      startTime: true,
      endTime: true,
      location: true,
      description: true,
      participants: {
        select: {
          email: true,
        },
      },
    },
  });

  const total = await prisma.event.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// Get a single event by ID
const getSingleEvent = async (eventId: number) => {
  const result = await prisma.event.findUniqueOrThrow({
    where: {
      id: eventId,
    },
    select: {
      id: true,
      name: true,
      date: true,
      startTime: true,
      endTime: true,
      location: true,
      description: true,
      participants: {
        where: {
          isDeleted: false,
        },
        select: {
          email: true,
          id: true,
        },
      },
    },
  });
  return result;
};

const updateEvent = async (eventId: number, eventData: Partial<Event>) => {
  const { name, date, startTime, endTime, location, description } = eventData;

  // Validate date and time formats
  if (!moment(date, "YYYY-MM-DD", true).isValid()) {
    throw new APIError(
      httpStatus.NOT_ACCEPTABLE,
      "Invalid date format. Please use YYYY-MM-DD."
    );
  }
  if (
    !moment(startTime, "HH:mm", true).isValid() ||
    !moment(endTime, "HH:mm", true).isValid()
  ) {
    throw new APIError(
      httpStatus.NOT_ACCEPTABLE,
      "Invalid time format. Please use HH:mm."
    );
  }
  if (!moment(startTime, "HH:mm").isBefore(moment(endTime, "HH:mm"))) {
    throw new APIError(
      httpStatus.NOT_ACCEPTABLE,
      "Start time must be before end time."
    );
  }

  // Check for time conflicts with other events at the same location
  const conflictingEvent = await prisma.event.findFirst({
    where: {
      location,
      date: moment(date).toDate(),

      AND: [
        {
          OR: [
            {
              startTime: { lte: moment(endTime, "HH:mm").format("HH:mm") },
              endTime: { gte: moment(startTime, "HH:mm").format("HH:mm") },
            },
            {
              startTime: { gte: moment(startTime, "HH:mm").format("HH:mm") },
              endTime: { lte: moment(endTime, "HH:mm").format("HH:mm") },
            },
            {
              startTime: { lte: moment(startTime, "HH:mm").format("HH:mm") },
              endTime: { gte: moment(startTime, "HH:mm").format("HH:mm") },
            },
            {
              startTime: { lte: moment(endTime, "HH:mm").format("HH:mm") },
              endTime: { gte: moment(endTime, "HH:mm").format("HH:mm") },
            },
          ],
        },
      ],
    },
  });

  if (conflictingEvent) {
    throw new APIError(
      httpStatus.CONFLICT,
      "Time conflict with another event at the same location."
    );
  }

  // Use a transaction to update the event and participants together
  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: {
      name,
      date: moment(date).toDate(),
      startTime,
      endTime,
      location,
      description,
    },
    select: {
      name: true,
      date: true,
      startTime: true,
      endTime: true,
      location: true,
      description: true,
    },
  });
  return updatedEvent;
};

// Delete an event by setting it as unavailable
const deleteEvent = async (eventId: number) => {
  const result = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

// Add a participant to an event
const addParticipant = async ({
  eventIdNumber,
  participants,
}: TAddParticipant) => {
  // Check if event exists
  const event = await prisma.event.findUnique({
    where: { id: eventIdNumber },
  });

  if (!event) {
    throw new APIError(httpStatus.NOT_FOUND, "Event not found.");
  }

  // Find existing participants
  const existingParticipants = await prisma.participant.findMany({
    where: {
      email: {
        in: participants,
      },
    },
    select: {
      email: true,
      id: true,
    },
  });

  // Extract existing emails
  const existingEmails = existingParticipants.map((p) => p.email);

  // Filter out emails that do not exist
  const newEmails = participants.filter(
    (email) => !existingEmails.includes(email)
  );

  // Create new participants
  const addedParticipants = await Promise.all(
    newEmails.map((email: string) => {
      return prisma.participant.create({
        data: {
          email,
          event: {
            connect: { id: eventIdNumber },
          },
        },
        select: {
          email: true,
          eventId: true,
        },
      });
    })
  );

  return addedParticipants;
};

// Remove a participant from an event
const removeParticipant = async ({
  eventIdNumber,
  participantIdNumber,
}: TRemoveParticipant) => {
  const event = await prisma.event.findUnique({
    where: { id: eventIdNumber },
  });

  if (!event) {
    throw new APIError(httpStatus.NOT_FOUND, "Event not found.");
  }

  // Find participant by participantId and event ID
  const participant = await prisma.participant.findFirst({
    where: {
      eventId: eventIdNumber,
      id: participantIdNumber,
    },
  });

  if (!participant) {
    throw new APIError(httpStatus.NOT_FOUND, "Participant not found.");
  }

  // Remove participant
  const result = await prisma.participant.update({
    where: {
      id: participant.id,
    },
    data: {
      isDeleted: true,
    },
  });

  return result;
};

export const eventServices = {
  createEvent,
  getEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
  addParticipant,
  removeParticipant,
};
