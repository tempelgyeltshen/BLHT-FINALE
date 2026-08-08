import type { RequestHandler } from 'express';
import { ZodError, type ZodType } from 'zod';
import { ValidationError } from '../errors/ValidationError.js';

export const validate = (schema: ZodType): RequestHandler => {
  return (req, _res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationError('Invalid request.', error.flatten()));
      } else {
        next(error);
      }
    }
  };
};
