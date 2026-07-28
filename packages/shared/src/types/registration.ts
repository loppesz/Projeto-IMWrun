/**
 * Google Sheets sync status for a registration.
 * - pending: not yet synced
 * - synced: successfully synced to Google Sheets
 * - failed: all retry attempts exhausted
 */
export type SheetsSyncStatus = 'pending' | 'synced' | 'failed';

export interface Registration {
  participantId: string;
  raceId: string;
  registeredAt: Date;
  sheetsSyncStatus: SheetsSyncStatus;
}
