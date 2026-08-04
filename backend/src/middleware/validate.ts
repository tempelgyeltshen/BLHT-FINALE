import type { RequestHandler } from 'express';
import { ZodError, type ZodType } from 'zod';

export const validate = (schema: ZodType): RequestHandler => {
  return (req, _res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(Object.assign(error, { statusCode: 400 }));
      } else {
        next(error);
      }
    }
  };
};
