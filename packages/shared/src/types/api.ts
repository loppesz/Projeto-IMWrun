/**
 * Standard API error response shape.
 * All API errors returned by IMW Run follow this structure.
 */
export interface ApiError {
  status: number; // HTTP status code
  code: string; // Machine-readable error code, e.g. "PHONE_DUPLICATE"
  message: string; // Human-readable message in pt-BR
  fields?: Record<string, string>; // Field-level errors for form validation
}
