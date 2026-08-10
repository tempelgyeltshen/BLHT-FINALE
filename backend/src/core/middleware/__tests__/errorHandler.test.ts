import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z, ZodError } from 'zod';
import type { NextFunction, Request, Response } from 'express';

vi.mock('../../config/logger.js', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    http: vi.fn(),
    debug: vi.fn(),
  },
}));

import { logger } from '../../config/logger.js';
import { errorHandler } from '../errorHandler.js';
import { AppError } from '../../errors/AppError.js';
import { ValidationError } from '../../errors/ValidationError.js';
import { AuthenticationError } from '../../errors/AuthenticationError.js';

const mockLogger = vi.mocked(logger);

function createRes() {
  const res: Record<string, any> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as unknown as Response;
}

const mockReq = {} as Request;
const mockNext = vi.fn() as unknown as NextFunction;

describe('errorHandler', () => {
  let res: ReturnType<typeof createRes>;

  beforeEach(() => {
    vi.clearAllMocks();
    res = createRes();
  });

  describe('4xx client errors', () => {
    it('should respond 400 and log at debug level for AppError 4xx', () => {
      errorHandler(new AppError(400, 'Bad request.'), mockReq, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: { message: 'Bad request.' } });
      expect(mockLogger.debug).toHaveBeenCalledWith('Request error', {
        statusCode: 400,
        error: 'Bad request.',
      });
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should respond 401 and log at debug level for AuthenticationError', () => {
      errorHandler(new AuthenticationError('Authentication required.'), mockReq, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: { message: 'Authentication required.' } });
      expect(mockLogger.debug).toHaveBeenCalledWith('Request error', {
        statusCode: 401,
        error: 'Authentication required.',
      });
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should respond 400 with flattened details and log at debug for ZodError', () => {
      let zodError: ZodError;
      try {
        z.object({ name: z.string() }).parse({ name: 123 });
        throw new Error('should have thrown');
      } catch (error) {
        zodError = error as ZodError;
      }

      errorHandler(zodError, mockReq, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'Invalid request.',
            details: expect.any(Object),
          }),
        })
      );
      expect(mockLogger.debug).toHaveBeenCalledWith('Request validation error', {
        error: expect.any(String),
      });
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should respond 400 with details and log at debug for ValidationError', () => {
      const details = { fieldErrors: { email: ['Invalid email.'] } };
      errorHandler(new ValidationError('Invalid request.', details), mockReq, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: { message: 'Invalid request.', details },
      });
      expect(mockLogger.debug).toHaveBeenCalledWith('Request validation error', {
        error: 'Invalid request.',
      });
      expect(mockLogger.error).not.toHaveBeenCalled();
    });
  });

  describe('5xx server errors', () => {
    it('should respond 500 and log at error level for AppError 5xx', () => {
      const error = new AppError(500, 'Database unavailable.');
      errorHandler(error, mockReq, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: { message: 'Database unavailable.' } });
      expect(mockLogger.error).toHaveBeenCalledWith('Unhandled error', {
        error: 'Database unavailable.',
        stack: expect.any(String),
      });
    });

    it('should respond 503 and log at error level for AppError 5xx', () => {
      errorHandler(new AppError(503, 'Service unavailable.'), mockReq, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(mockLogger.error).toHaveBeenCalledWith('Unhandled error', {
        error: 'Service unavailable.',
        stack: expect.any(String),
      });
    });

    it('should respond 500 and log at error level for unknown errors', () => {
      const error = new Error('Unexpected failure.');
      errorHandler(error, mockReq, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: { message: 'An unexpected server error occurred.' },
      });
      expect(mockLogger.error).toHaveBeenCalledWith('Unhandled error', {
        error: 'Unexpected failure.',
        stack: expect.any(String),
      });
    });
  });
});
