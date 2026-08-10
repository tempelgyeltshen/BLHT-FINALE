import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';
import { ValidationError } from '../errors/ValidationError.js';
import { logger } from '../config/logger.js';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    logger.debug('Request validation error', { error: error.message });
    return res.status(400).json({
      error: {
        message: 'Invalid request.',
        details: error.flatten()
      }
    });
  }

  if (error instanceof ValidationError) {
    logger.debug('Request validation error', { error: error.message });
    return res.status(400).json({
      error: {
        message: error.message,
        ...(error.details !== undefined ? { details: error.details } : {})
      }
    });
  }

  if (error instanceof AppError) {
    // Expected client errors (4xx - e.g. 401 auth failures, 404s) should not
    // be logged as errors; they are normal request outcomes. Only log genuine
    // server-side failures (5xx) with a stack trace.
    if (error.statusCode >= 500) {
      logger.error('Unhandled error', { error: error.message, stack: error.stack });
    } else {
      logger.debug('Request error', { statusCode: error.statusCode, error: error.message });
    }

    return res.status(error.statusCode).json({
      error: { message: error.message }
    });
  }

  // Unknown/unexpected errors - always log with a stack trace
  logger.error('Unhandled error', { error: error.message, stack: error.stack });
  return res.status(500).json({
    error: { message: 'An unexpected server error occurred.' }
  });
};
