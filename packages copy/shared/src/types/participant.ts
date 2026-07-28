export interface Participant {
  id: string;
  participantNumber: string; // zero-padded 4 digits, e.g. "0042"
  name: string;
  phone: string;
  age: number;
  gender?: 'M' | 'F';
  registeredAt: Date;
}
