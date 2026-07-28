export interface OtpRecord {
  phone: string;
  code: string; // 6-digit hashed
  expiresAt: Date;
  attempts: number;
  invalidated: boolean;
}
