import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';
import { ValidationError } from '../errors/ValidationError.js';
import { logger } from '../config/logger.js';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  logger.error('Unhandled error', { error: error.message, stack: error.stack });
  
  if (error instanceof ZodError) {
    return res.status(400).json({ 
      error: { 
        message: 'Invalid request.', 
        details: error.flatten() 
      } 
    });
  }
  
  if (error instanceof ValidationError) {
    return res.status(400).json({ 
      error: { 
        message: error.message, 
        ...(error.details !== undefined ? { details: error.details } : {}) 
      } 
    });
  }
  
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ 
      error: { message: error.message } 
    });
  }
  
  return res.status(500).json({ 
    error: { message: 'An unexpected server error occurred.' } 
  });
};
