import { AppError } from './AppError.js';

/**
 * Error thrown when a request body/query fails validation.
 * Always maps to HTTP 400 and may carry structured `details`
 * (e.g. a Zod flattened error) for the error handler to surface.
 */
export class ValidationError extends AppError {
  constructor(message = 'Invalid request.', public details?: unknown) {
    super(400, message);
  }
}
