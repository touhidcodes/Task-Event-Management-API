export interface TCreateEventData {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  participants?: string[];
}
export interface TUpdateEventData {
  name?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  participants?: string[];
}

export interface TAddParticipant {
  eventIdNumber: number;
  participants: string[];
}

export interface TRemoveParticipant {
  eventIdNumber: number;
  participantIdNumber: number;
}
