/**
 * Run session status values.
 * - active: session is currently in progress
 * - completed: session ended successfully with >= 5000m valid distance
 * - manual_stop: participant manually ended the session
 * - pending_review: result flagged for admin review (inconsistent GPS)
 * - rejected: session rejected (< 10 GPS points or validation failure)
 */
export type RunSessionStatus =
  | 'active'
  | 'completed'
  | 'manual_stop'
  | 'pending_review'
  | 'rejected';

export interface GpsPoint {
  lat: number;
  lng: number;
  timestamp: number; // Unix ms
  onRoute: boolean;
  distanceDelta: number; // meters accumulated from previous point
}

export interface RunSession {
  id: string;
  participantId: string;
  raceId: string;
  startedAt: Date;
  endedAt?: Date;
  validDistanceMeters: number;
  totalTimeSeconds: number;
  avgPace?: number; // min/km, calculated as (totalTimeSeconds/60) / (validDistanceMeters/1000)
  gpsPoints: GpsPoint[];
  deviceId: string;
  userAgent: string;
  status: RunSessionStatus;
}
