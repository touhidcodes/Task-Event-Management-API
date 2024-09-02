export interface TCreateEventData {
  name: string;
  date: string; // expects date in "YYYY-MM-DD" format
  startTime: string; // expects time in "HH:mm" format
  endTime: string; // expects time in "HH:mm" format
  location: string;
  description: string;
  participantEmails?: string[]; // optional array of participant emails
}
