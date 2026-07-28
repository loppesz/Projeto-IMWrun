/**
 * Race status values.
 * - locked: race is not yet available
 * - available: race is open for registration and participation
 * - ongoing: race event is currently happening
 * - finished: race event has concluded
 */
export type RaceStatus = 'locked' | 'available' | 'ongoing' | 'finished';

export interface Race {
  id: string;
  sequenceNumber: number; // 1-12
  name: string;
  date: Date;
  location: string;
  distanceMeters: number; // always 5000
  status: RaceStatus;
  hasRoute: boolean;
}
