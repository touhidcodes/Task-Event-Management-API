import { Event, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";
import { eventSearchableFields } from "./event.constants";
import moment from "moment";
import { TCreateEventData } from "./event.interface";

const createEvent = async (eventData: TCreateEventData): Promise<Event> => {
  const {
    name,
    date,
    startTime,
    endTime,
    location,
    description,
    participantEmails = [],
  } = eventData;

  // Validate date and time formats
  if (!moment(date, "YYYY-MM-DD", true).isValid()) {
    throw new Error("Invalid date format. Please use YYYY-MM-DD.");
  }
  if (
    !moment(startTime, "HH:mm", true).isValid() ||
    !moment(endTime, "HH:mm", true).isValid()
  ) {
    throw new Error("Invalid time format. Please use HH:mm.");
  }
  if (!moment(startTime, "HH:mm").isBefore(moment(endTime, "HH:mm"))) {
    throw new Error("Start time must be before end time.");
  }

  // Convert date and time to full Date object
  const eventStart = moment(
    `${date} ${startTime}`,
    "YYYY-MM-DD HH:mm"
  ).toDate();
  const eventEnd = moment(`${date} ${endTime}`, "YYYY-MM-DD HH:mm").toDate();

  // Check for time conflicts with other events at the same location
  const conflictingEvent = await prisma.event.findFirst({
    where: {
      location,
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
    throw new Error("Time conflict with another event at the same location.");
  }

  if (conflictingEvent) {
    throw new Error("Time conflict with another event at the same location.");
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
      participantEmails.map(async (email) => {
        await tx.participant.upsert({
          where: { email },
          update: { event: { connect: { id: createdEvent.id } } },
          create: { email, event: { connect: { id: createdEvent.id } } },
        });
      })
    );

    // Return the created event
    return createdEvent;
  });

  return newEvent;
};

// // Get all events with optional filters and pagination
// const getEvents = async (params: any, options: TPaginationOptions) => {
//   const { page, limit, skip } = paginationHelper.calculatePagination(options);
//   const { searchTerm, eventDate, location, ...filterData } = params;

//   const andConditions: Prisma.EventWhereInput[] = [];

//   // Search term conditions
//   if (searchTerm) {
//     andConditions.push({
//       OR: eventSearchableFields.map((field) => ({
//         [field]: {
//           contains: searchTerm,
//           mode: "insensitive",
//         },
//       })),
//     });
//   }

//   // Additional filters
//   if (Object.keys(filterData).length > 0) {
//     andConditions.push({
//       AND: Object.keys(filterData).map((key) => ({
//         [key]: {
//           equals: (filterData as any)[key],
//         },
//       })),
//     });
//   }

//   const whereConditions: Prisma.EventWhereInput =
//     andConditions.length > 0 ? { AND: andConditions } : {};

//   const result = await prisma.event.findMany({
//     where: whereConditions,
//     skip,
//     take: limit,
//     orderBy:
//       options.sortBy && options.sortOrder
//         ? {
//             [options.sortBy]: options.sortOrder,
//           }
//         : {
//             createdAt: "desc",
//           },
//   });

//   const total = await prisma.event.count({
//     where: whereConditions,
//   });

//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: result,
//   };
// };

// // Get a single event by ID
// const getSingleEvent = async (eventId: number) => {
//   const result = await prisma.event.findUniqueOrThrow({
//     where: {
//       id: eventId,
//     },
//   });
//   return result;
// };

// // Get events created by the authenticated user
// const getMyEvents = async (eventId: number) => {
//   const result = await prisma.event.findMany({
//     where: {
//       id: eventId,
//     },
//   });
//   return result;
// };

// // Update an existing event by ID
// const updateEvent = async (eventId: number, eventData: Partial<Event>) => {
//   const result = await prisma.event.update({
//     where: {
//       id: eventId,
//     },
//     data: eventData,
//   });
//   return result;
// };

// // Delete an event by setting it as unavailable
// const deleteEvent = async (eventId: number) => {
//   const result = await prisma.event.update({
//     where: {
//       id: eventId,
//     },
//     data: {
//       isDeleted: true,
//     },
//   });
//   return result;
// };

// // Add a participant to an event
// const addParticipant = async (eventId: number, email: string) => {
//   const result = await prisma.participant.create({
//     data: {
//       eventId,
//       email,
//     },
//   });
//   return result;
// };

// // Remove a participant from an event
// const removeParticipant = async (eventId: number, participantId: number) => {
//   const result = await prisma.participant.delete({
//     where: {
//       id: participantId,
//       eventId: eventId,
//     },
//   });
//   return result;
// };

export const eventServices = {
  createEvent,
  // getEvents,
  // getSingleEvent,
  // getMyEvents,
  // updateEvent,
  // deleteEvent,
  // addParticipant,
  // removeParticipant,
};
