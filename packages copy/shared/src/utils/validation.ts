/**
 * Shared validation utilities used by both frontend and backend.
 * These are pure functions with no side effects.
 */

/**
 * Validates a Brazilian phone number.
 * Accepts 10 or 11 numeric digits (DDD + number).
 */
export function validatePhone(phone: string): boolean {
  return /^\d{10,11}$/.test(phone);
}

/**
 * Validates participant age.
 * Must be an integer between 1 and 120 (inclusive).
 */
export function validateAge(age: number): boolean {
  return Number.isInteger(age) && age >= 1 && age <= 120;
}

/**
 * Validates participant full name.
 * Must be between 2 and 100 characters (after trimming).
 */
export function validateName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
}

/**
 * Zero-pads a participant sequence number to 4 digits.
 * e.g. padParticipantNumber(42) → "0042"
 * e.g. padParticipantNumber(1) → "0001"
 * e.g. padParticipantNumber(9999) → "9999"
 */
export function padParticipantNumber(n: number): string {
  if (n < 1 || n > 9999 || !Number.isInteger(n)) {
    throw new RangeError(`Participant number must be an integer between 1 and 9999, got ${n}`);
  }
  return String(n).padStart(4, '0');
}
