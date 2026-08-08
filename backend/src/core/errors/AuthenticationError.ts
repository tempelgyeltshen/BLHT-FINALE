import { AppError } from './AppError.js';

/**
 * Error thrown when a request is not authenticated or the provided
 * credentials/token are invalid. Always maps to HTTP 401.
 */
export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required.') {
    super(401, message);
  }
}
